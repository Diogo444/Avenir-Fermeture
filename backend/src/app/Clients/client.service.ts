import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { Produit } from '../produits/produits.entity';
import { Commercial } from '../commercial/entities/commercial.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
    @InjectRepository(Commercial)
    private readonly commercialRepository: Repository<Commercial>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['produits', 'commerciaux'] });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { produitIds, commercialIds, ...clientData } = createClientDto;

    let produits: Produit[] | undefined = undefined;
    if (produitIds && produitIds.length > 0) {
      produits = await this.produitRepository.find({ where: { id: In(produitIds) } });
    }

    let commerciaux: Commercial[] | undefined = undefined;
    if (commercialIds && commercialIds.length > 0) {
      commerciaux = await this.commercialRepository.find({ where: { id: In(commercialIds) } });
    }

    const client = this.clientRepository.create({
      ...clientData,
      ...(produits ? { produits } : {}),
      ...(commerciaux ? { commerciaux } : {}),
    });

    return this.clientRepository.save(client);
  }

  // delete
  async delete(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async findOne(codeClient: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { code_client: codeClient },
      relations: ['produits', 'commerciaux'],
    });
  }
}

