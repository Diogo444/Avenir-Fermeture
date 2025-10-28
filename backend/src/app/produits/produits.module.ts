import { Module } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { ProduitsController } from './produits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from './entities/produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produit])],
  controllers: [ProduitsController],
  providers: [ProduitsService],
})
export class ProduitsModule {}
