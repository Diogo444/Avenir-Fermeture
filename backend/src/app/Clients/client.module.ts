import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { Produit } from '../produits/produits.entity';
import { Commercial } from '../commercial/entities/commercial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Produit, Commercial])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
