import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Commande } from './entities/commande.entity';
import { CommandeProduit } from './entities/commandeProduit.entity';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { Client } from '../Clients/entities/client.entity';
import { Produit } from '../produits/entities/produit.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';
import { Status } from '../status/entities/status.entity';
import { CreateCommandeProduitDto } from './dto/create-commande-produit.dto';
import { StatutCommande } from './commandes.types';
import { FindCommandesQuery } from './dto/find-commandes.query';

@Injectable()
export class CommandesService {
  constructor(
    @InjectRepository(Commande)
    private readonly commandeRepository: Repository<Commande>,
    @InjectRepository(CommandeProduit)
    private readonly commandeProduitRepository: Repository<CommandeProduit>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Fournisseur)
    private readonly fournisseurRepository: Repository<Fournisseur>,
  ) {}

  async create(createCommandeDto: CreateCommandeDto) {
    const client = await this.clientRepository.findOne({
      where: { id: createCommandeDto.clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client ${createCommandeDto.clientId} introuvable`);
    }

    const fournisseur = await this.resolveFournisseur(createCommandeDto.fournisseurId);
    const commandesProduits = await this.buildCommandeProduits(createCommandeDto.produits);

    const commande = this.commandeRepository.create({
      client,
      fournisseur,
      reference_commande: createCommandeDto.reference_commande,
      numero_commande_interne: createCommandeDto.numero_commande_interne,
      numero_devis: createCommandeDto.numero_devis ?? null,
      date_signature: this.toDate(createCommandeDto.date_signature),
      montant_ht: this.toNumber(createCommandeDto.montant_ht),
      montant_ttc: this.toNumber(createCommandeDto.montant_ttc),
      type_acompte: createCommandeDto.type_acompte,
      statut_commande: createCommandeDto.statut_commande ?? StatutCommande.EN_COURS,
      permis_dp: createCommandeDto.permis_dp ?? false,
      commentaires: createCommandeDto.commentaires ?? null,
      date_metre: this.toDate(createCommandeDto.date_metre),
      date_avenant: this.toDate(createCommandeDto.date_avenant),
      date_limite_pose: this.toDate(createCommandeDto.date_limite_pose),
      date_livraison_souhaitee: this.toDate(createCommandeDto.date_livraison_souhaitee),
      commandesProduits,
    });

    return this.commandeRepository.save(commande);
  }

  async findAll(query?: FindCommandesQuery) {
    const { page, pageSize } = this.normalizePagination(query?.page, query?.pageSize);
    const includeDetails = query?.include === 'detail';

    const qb = this.commandeRepository.createQueryBuilder('commande');

    if (includeDetails) {
      qb.leftJoinAndSelect('commande.client', 'client')
        .leftJoinAndSelect('commande.fournisseur', 'fournisseur')
        .leftJoinAndSelect('commande.commandesProduits', 'commandesProduits')
        .leftJoinAndSelect('commandesProduits.fournisseur', 'fournisseurProduit')
        .leftJoinAndSelect('commandesProduits.produit', 'produit')
        .leftJoinAndSelect('commandesProduits.status', 'status');
    }

    qb.orderBy('commande.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, pageSize };
  }

  findByClientId(clientId: number) {
    return this.commandeRepository.find({
      where: { client: { id: clientId } },
      relations: [
        'fournisseur',
        'commandesProduits',
        'commandesProduits.fournisseur',
        'commandesProduits.produit',
        'commandesProduits.status',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const commande = await this.commandeRepository.findOne({
      where: { id },
      relations: [
        'client',
        'fournisseur',
        'commandesProduits',
        'commandesProduits.fournisseur',
        'commandesProduits.produit',
        'commandesProduits.status',
      ],
    });
    if (!commande) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }
    return commande;
  }

  async update(id: number, updateCommandeDto: UpdateCommandeDto) {
    const commande = await this.commandeRepository.findOne({
      where: { id },
      relations: ['commandesProduits'],
    });
    if (!commande) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }

    if (typeof updateCommandeDto.clientId !== 'undefined') {
      const client = await this.clientRepository.findOne({
        where: { id: updateCommandeDto.clientId },
      });
      if (!client) {
        throw new NotFoundException(`Client ${updateCommandeDto.clientId} introuvable`);
      }
      commande.client = client;
    }

    if (typeof updateCommandeDto.fournisseurId !== 'undefined') {
      commande.fournisseur = await this.resolveFournisseur(updateCommandeDto.fournisseurId);
    }

    if (typeof updateCommandeDto.reference_commande !== 'undefined') {
      commande.reference_commande = updateCommandeDto.reference_commande;
    }

    if (typeof updateCommandeDto.numero_commande_interne !== 'undefined') {
      commande.numero_commande_interne = updateCommandeDto.numero_commande_interne;
    }

    if (typeof updateCommandeDto.numero_devis !== 'undefined') {
      commande.numero_devis = updateCommandeDto.numero_devis;
    }

    if (typeof updateCommandeDto.date_signature !== 'undefined') {
      commande.date_signature = this.toDate(updateCommandeDto.date_signature);
    }

    if (typeof updateCommandeDto.montant_ht !== 'undefined') {
      commande.montant_ht = this.toNumber(updateCommandeDto.montant_ht);
    }

    if (typeof updateCommandeDto.montant_ttc !== 'undefined') {
      commande.montant_ttc = this.toNumber(updateCommandeDto.montant_ttc);
    }

    if (typeof updateCommandeDto.type_acompte !== 'undefined') {
      commande.type_acompte = updateCommandeDto.type_acompte;
    }

    if (typeof updateCommandeDto.statut_commande !== 'undefined') {
      commande.statut_commande = updateCommandeDto.statut_commande;
    }

    if (typeof updateCommandeDto.permis_dp !== 'undefined') {
      commande.permis_dp = updateCommandeDto.permis_dp;
    }

    if (typeof updateCommandeDto.commentaires !== 'undefined') {
      commande.commentaires = updateCommandeDto.commentaires;
    }

    if (typeof updateCommandeDto.date_metre !== 'undefined') {
      commande.date_metre = this.toDate(updateCommandeDto.date_metre);
    }

    if (typeof updateCommandeDto.date_avenant !== 'undefined') {
      commande.date_avenant = this.toDate(updateCommandeDto.date_avenant);
    }

    if (typeof updateCommandeDto.date_limite_pose !== 'undefined') {
      commande.date_limite_pose = this.toDate(updateCommandeDto.date_limite_pose);
    }

    if (typeof updateCommandeDto.date_livraison_souhaitee !== 'undefined') {
      commande.date_livraison_souhaitee = this.toDate(updateCommandeDto.date_livraison_souhaitee);
    }

    if (typeof updateCommandeDto.produits !== 'undefined') {
      commande.commandesProduits = await this.buildCommandeProduits(updateCommandeDto.produits);
    }

    return this.commandeRepository.save(commande);
  }

  async remove(id: number) {
    const commande = await this.commandeRepository.findOne({ where: { id } });
    if (!commande) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }
    await this.commandeRepository.remove(commande);
    return { deleted: true };
  }

  private async resolveFournisseur(fournisseurId?: number | null) {
    if (typeof fournisseurId === 'undefined') {
      return undefined;
    }
    if (fournisseurId === null) {
      return null;
    }
    const fournisseur = await this.fournisseurRepository.findOne({
      where: { id: fournisseurId },
    });
    if (!fournisseur) {
      throw new NotFoundException(`Fournisseur ${fournisseurId} introuvable`);
    }
    return fournisseur;
  }

  private async buildCommandeProduits(items?: CreateCommandeProduitDto[]) {
    if (!items || items.length === 0) {
      return [];
    }

    const produitIds = Array.from(new Set(items.map(item => item.produitId)));
    const statusIds = Array.from(
      new Set(items.map(item => item.statusId).filter((id): id is number => typeof id === 'number')),
    );
    const fournisseurIds = Array.from(
      new Set(items.map(item => item.fournisseurId).filter((id): id is number => typeof id === 'number')),
    );

    const produits = await this.produitRepository.findBy({ id: In(produitIds) });
    const statuses = statusIds.length
      ? await this.statusRepository.findBy({ id: In(statusIds) })
      : [];
    const fournisseurs = fournisseurIds.length
      ? await this.fournisseurRepository.findBy({ id: In(fournisseurIds) })
      : [];

    const produitMap = new Map(produits.map(produit => [produit.id, produit]));
    const statusMap = new Map(statuses.map(status => [status.id, status]));
    const fournisseurMap = new Map(fournisseurs.map(fournisseur => [fournisseur.id, fournisseur]));

    const missingProduits = produitIds.filter(id => !produitMap.has(id));
    if (missingProduits.length > 0) {
      throw new NotFoundException(`Produit(s) introuvable(s): ${missingProduits.join(', ')}`);
    }

    const missingStatuses = statusIds.filter(id => !statusMap.has(id));
    if (missingStatuses.length > 0) {
      throw new NotFoundException(`Statut introuvable: ${missingStatuses.join(', ')}`);
    }

    const missingFournisseurs = fournisseurIds.filter(id => !fournisseurMap.has(id));
    if (missingFournisseurs.length > 0) {
      throw new NotFoundException(`Fournisseur(s) introuvable(s): ${missingFournisseurs.join(', ')}`);
    }

    return items.map(item =>
      this.commandeProduitRepository.create({
        produit: produitMap.get(item.produitId) ?? null,
        quantite: Number(item.quantite ?? 0),
        status: item.statusId ? statusMap.get(item.statusId) ?? null : null,
        fournisseur: item.fournisseurId ? fournisseurMap.get(item.fournisseurId) ?? null : null,
        note: item.note ?? null,
        avenant: item.avenant ?? false,
      }),
    );
  }

  private toDate(value?: string | Date | null): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    return new Date(value);
  }

  private toNumber(value?: number | string | null): number | null {
    if (value === null || typeof value === 'undefined') {
      return null;
    }
    return typeof value === 'string' ? Number(value) : value;
  }

  private normalizePagination(page?: number | string, pageSize?: number | string) {
    const size = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
    const pageNum = Math.max(Number(page) || 1, 1);
    return { page: pageNum, pageSize: size };
  }
}
