import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Titre } from '../titres/entities/titre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Titre])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
