import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['produits'] });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { produitIds, ...clientData } = createClientDto;

    const produits =
      produitIds && produitIds.length > 0
        ? produitIds.map((id) => ({ id }))
        : undefined;

    const client = this.clientRepository.create({
      ...clientData,
      ...(produits ? { produits } : {}),
    });

    return this.clientRepository.save(client);
  }
}

