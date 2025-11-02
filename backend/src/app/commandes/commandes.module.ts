import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './entities/commande.entity';
import { CommandeProduit } from './entities/commandeProduit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commande, CommandeProduit])],
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
