import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produit } from './produits.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
  ) {}

  async findAll(): Promise<Produit[]> {
    return this.produitRepository.find();
  }

  async create(produit: Produit): Promise<Produit> {
    return this.produitRepository.save(produit);
  }
}
