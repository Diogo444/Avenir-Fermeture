import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './entities/commande.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commande])],
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
