import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './entities/commande.entity';
import { CommandeProduit } from './entities/commandeProduit.entity';
import { Client } from '../clients/entities/client.entity';
import { Produit } from '../produits/entities/produit.entity';
import { EtatProduit } from '../etatProduit/entities/etat-produit.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commande,
      CommandeProduit,
      Client,
      Produit,
      EtatProduit,
      Fournisseur,
    ]),
  ],
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
