import { Module } from '@nestjs/common';
import { EtatProduitService } from './etat-produit.service';
import { EtatProduitController } from './etat-produit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtatProduit } from './entities/etat-produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EtatProduit])],
  controllers: [EtatProduitController],
  providers: [EtatProduitService],
})
export class EtatProduitModule {}
