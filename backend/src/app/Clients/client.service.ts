import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { Produit } from '../produits/produits.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['produits'] });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { produitIds, ...clientData } = createClientDto;

    let produits: Produit[] | undefined = undefined;
    if (produitIds && produitIds.length > 0) {
      produits = await this.produitRepository.find({ where: { id: In(produitIds) } });
    }

    const client = this.clientRepository.create({
      ...clientData,
      ...(produits ? { produits } : {}),
    });

    return this.clientRepository.save(client);
  }
}

