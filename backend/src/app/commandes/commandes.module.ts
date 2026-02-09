import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './entities/commande.entity';
import { CommandeProduit } from './entities/commandeProduit.entity';
import { Client } from '../Clients/entities/client.entity';
import { Produit } from '../produits/entities/produit.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';
import { Status } from '../status/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commande,
      CommandeProduit,
      Client,
      Produit,
      Status,
      Fournisseur,
    ]),
  ],
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
