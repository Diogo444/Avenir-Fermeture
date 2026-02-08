import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Titre } from '../titres/entities/titre.entity';
import { FindClientsQuery } from './dto/find-clients.query';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Titre)
    private readonly titreRepository: Repository<Titre>,
  ){}
  async create(createClientDto: CreateClientDto) {
    const { title: titleName, titleId, ...rest } = createClientDto as CreateClientDto & {
      title?: string;
      titleId?: number | string | null;
    };

    let titre: Titre | null = null;
    if (typeof titleId !== 'undefined') {
      if (titleId !== null) {
        const normalizedId = this.normalizeId(titleId);
        if (normalizedId === null) {
          throw new NotFoundException(`Titre invalide`);
        }
        titre = await this.titreRepository.findOne({ where: { id: normalizedId } });
        if (!titre) {
          throw new NotFoundException(`Titre ${normalizedId} introuvable`);
        }
      }
    } else if (titleName) {
      titre = await this.titreRepository.findOne({ where: { name: titleName } });
      if (!titre) {
        throw new NotFoundException(`Titre '${titleName}' introuvable`);
      }
    }

    const clientData: Partial<Client> = {
      ...rest,
      ...(titre ? { title: titre } : {}),
    };

    const client = this.clientRepository.create(clientData);
    const saved = await this.clientRepository.save(client);

    if (saved) {
      const withRelation = await this.clientRepository.findOne({ where: { id: saved.id }, relations: ['title'] });
      if (withRelation) {
        const { title, ...c } = withRelation as Client;
        return { ...c, title: title?.name ?? null, titleId: title?.id ?? null };
      }
    }
    return saved;
  }

  async findAll(query: FindClientsQuery = {}) {
    const {
      q,
      title: titleName,
      hasEmail,
      hasPhone,
      city,
      code_postal,
      sort,
      order,
      page,
      pageSize,
      include,
    } = query;

    const includeMode = include === 'detail' ? 'detail' : 'summary';
    const qb = this.clientRepository.createQueryBuilder('client');
    if (includeMode === 'detail') {
      qb.leftJoinAndSelect('client.title', 'title');
    } else {
      qb.leftJoin('client.title', 'title');
    }

    if (q && q.trim() !== '') {
      const like = `%${q.trim()}%`;
      qb.andWhere(
        `(
          client.code_client LIKE :like OR
          client.firstName LIKE :like OR
          client.lastName LIKE :like OR
          client.email LIKE :like OR
          client.rue LIKE :like OR
          client.ville LIKE :like
        )`,
        { like },
      );
    }

    if (titleName) {
      qb.andWhere('title.name = :titleName', { titleName });
    }

    if (city && city.trim() !== '') {
      qb.andWhere('client.ville LIKE :cityLike', { cityLike: `%${city.trim()}%` });
    }

    if (typeof code_postal !== 'undefined' && code_postal !== null && `${code_postal}`.trim() !== '') {
      const codePostalValue = `${code_postal}`.trim();
      const codePostalNumber = Number(codePostalValue);
      if (!Number.isNaN(codePostalNumber)) {
        qb.andWhere('client.code_postal = :codePostal', { codePostal: codePostalNumber });
      } else {
        qb.andWhere('CAST(client.code_postal AS CHAR) LIKE :cpLike', { cpLike: `%${codePostalValue}%` });
      }
    }

    if (hasEmail === 'true' || hasEmail === true) {
      qb.andWhere("client.email IS NOT NULL AND client.email <> ''");
    }

    if (hasPhone === 'true' || hasPhone === true) {
      qb.andWhere(
        `(
          (client.phone_1 IS NOT NULL AND client.phone_1 <> '') OR
          (client.phone_2 IS NOT NULL AND client.phone_2 <> '') OR
          (client.phone_3 IS NOT NULL AND client.phone_3 <> '')
        )`,
      );
    }

    // Sorting
    const sortField = ['createdAt', 'updatedAt', 'lastName', 'firstName'].includes(sort || '')
      ? (sort as string)
      : 'createdAt';
    const sortOrder = (order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(`client.${sortField}`, sortOrder as 'ASC' | 'DESC');

    // Pagination
    const size = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
    const pageNum = Math.max(Number(page) || 1, 1);
    qb.skip((pageNum - 1) * size).take(size);

    if (includeMode === 'summary') {
      qb.select('client.id', 'id')
        .addSelect('client.code_client', 'code_client')
        .addSelect('client.firstName', 'firstName')
        .addSelect('client.lastName', 'lastName')
        .addSelect('client.email', 'email')
        .addSelect('client.phone_1', 'phone_1')
        .addSelect('client.rue', 'rue')
        .addSelect('client.code_postal', 'code_postal')
        .addSelect('client.ville', 'ville')
        .addSelect('title.id', 'titleId')
        .addSelect('title.name', 'title');

      const rows = await qb.getRawMany();
      return rows.map((row) => ({
        id: Number(row.id),
        code_client: row.code_client,
        title: row.title ?? null,
        titleId: row.titleId !== null && typeof row.titleId !== 'undefined' ? Number(row.titleId) : null,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone_1: row.phone_1 ?? null,
        rue: row.rue ?? null,
        code_postal: row.code_postal !== null && typeof row.code_postal !== 'undefined' ? Number(row.code_postal) : null,
        ville: row.ville ?? null,
      }));
    }

    const clients = await qb.getMany();
    return clients.map((c: Client) => ({ ...c, title: c.title?.name ?? null, titleId: c.title?.id ?? null }));
  }

  async findOne(code_client: string) {
    const client = await this.clientRepository.findOne({ where: { code_client }, relations: ['title'] });
    if (!client) return null;
    const { title, ...c } = client as Client;
    return { ...c, title: title?.name ?? null, titleId: title?.id ?? null };
  }

  async update(code_client: string, updateClientDto: UpdateClientDto) {
    const { title: titleName, titleId, ...rest } = updateClientDto as UpdateClientDto & {
      title?: string | null;
      titleId?: number | string | null;
    };

    let titre: Titre | undefined;
    if (typeof titleId !== 'undefined') {
      if (titleId === null) {
        titre = undefined; // do not change relation if empty
      } else {
        const normalizedId = this.normalizeId(titleId);
        if (normalizedId === null) {
          throw new NotFoundException(`Titre invalide`);
        }
        const found = await this.titreRepository.findOne({ where: { id: normalizedId } });
        if (!found) throw new NotFoundException(`Titre ${normalizedId} introuvable`);
        titre = found;
      }
    } else if (typeof titleName !== 'undefined') {
      if (titleName === null || titleName === '') {
        titre = undefined; // do not change relation if empty
      } else {
        const found = await this.titreRepository.findOne({ where: { name: titleName } });
        if (!found) throw new NotFoundException(`Titre '${titleName}' introuvable`);
        titre = found;
      }
    }

    const clientToUpdate: Partial<Client> = {
      ...rest,
      ...((typeof titleId !== 'undefined' || typeof titleName !== 'undefined') && titre ? { title: titre } : {}),
    };

    await this.clientRepository.update({ code_client }, clientToUpdate);
    const updated = await this.clientRepository.findOne({ where: { code_client }, relations: ['title'] });
    if (!updated) return null;
    const { title, ...c } = updated as Client;
    return { ...c, title: title?.name ?? null, titleId: title?.id ?? null };
  }

  async remove(id: number) {
    return this.clientRepository.delete(id);
  }

  private normalizeId(value: number | string | null | undefined): number | null {
    if (value === null || typeof value === 'undefined' || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

}
