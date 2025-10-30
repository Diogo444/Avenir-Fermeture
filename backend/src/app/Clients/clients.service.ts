import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Titre } from '../titres/entities/titre.entity';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Titre)
    private readonly titreRepository: Repository<Titre>,
  ){}
  async create(createClientDto: CreateClientDto) {
    const { title: titleName, ...rest } = createClientDto as CreateClientDto & { title?: string };

    let titre: Titre | null = null;
    if (titleName) {
      titre = await this.titreRepository.findOne({ where: { name: titleName } });
      if (!titre) {
        throw new NotFoundException(`Titre '${titleName}' introuvable`);
      }
    }

    const clientData: Partial<Client> = {
      ...rest,
      ...(rest.code_postal && { code_postal: +rest.code_postal }),
      ...(titre ? { title: titre } : {}),
    };

    const client = this.clientRepository.create(clientData);
    const saved = await this.clientRepository.save(client);

    if (saved) {
      const withRelation = await this.clientRepository.findOne({ where: { id: saved.id }, relations: ['title'] });
      if (withRelation) {
        const { title, ...c } = withRelation as Client;
        return { ...c, title: title?.name ?? null };
      }
    }
    return saved;
  }

  async findAll() {
    const clients = await this.clientRepository.find({ relations: ['title'] });
    return clients.map((c: Client) => ({ ...c, title: c.title?.name ?? null }));
  }

  async findOne(code_client: string) {
    const client = await this.clientRepository.findOne({ where: { code_client }, relations: ['title'] });
    if (!client) return null;
    const { title, ...c } = client as Client;
    return { ...c, title: title?.name ?? null };
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const { title: titleName, ...rest } = updateClientDto as UpdateClientDto & { title?: string };

    let titre: Titre | undefined;
    if (typeof titleName !== 'undefined') {
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
      ...(rest.code_postal && { code_postal: +rest.code_postal }),
      ...(typeof titleName !== 'undefined' && titre ? { title: titre } : {}),
    };

    await this.clientRepository.update(id, clientToUpdate);
    const updated = await this.clientRepository.findOne({ where: { id }, relations: ['title'] });
    if (!updated) return null;
    const { title, ...c } = updated as Client;
    return { ...c, title: title?.name ?? null };
  }

  remove(id: number) {
    return this.clientRepository.delete(id);
  }
}
