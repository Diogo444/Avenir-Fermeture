import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ){}
  create(createClientDto: CreateClientDto) {
    const clientData = {
      ...createClientDto,
      ...(createClientDto.code_postal && { code_postal: +createClientDto.code_postal }),
    } as Partial<Client>;
    const client = this.clientRepository.create(clientData);
    return this.clientRepository.save(client);
  }

  findAll() {
    return this.clientRepository.find();
  }

  findOne(code_client: string) {
    return this.clientRepository.findOneBy({ code_client });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const clientToUpdate = {
      ...updateClientDto,
      ...(updateClientDto.code_postal && { code_postal: +updateClientDto.code_postal }),
    } as Partial<Client>;
    await this.clientRepository.update(id, clientToUpdate);
    return this.clientRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.clientRepository.delete(id);
  }
}
