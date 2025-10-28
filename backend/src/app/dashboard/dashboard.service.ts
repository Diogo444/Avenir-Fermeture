import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ){}
  async getNumberClients(): Promise<{ number_client: number }> {
    const total = await this.clientRepository.count();
    return { number_client: total };
  }

}
