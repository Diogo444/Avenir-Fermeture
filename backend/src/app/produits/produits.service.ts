import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produit } from './produits.entity';
import { Repository } from 'typeorm';
import { CreateProduitDto } from './DTO/create-produit.dto';

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
  ) {}

  async findAll(): Promise<Produit[]> {
    return this.produitRepository.find();
  }

  async findOne(id: number): Promise<Produit> {
    const produit = await this.produitRepository.findOne({ where: { id } });
    if (!produit) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }
    return produit;
  }

  async create(dto: CreateProduitDto): Promise<Produit> {
    const produit = this.produitRepository.create({ nom: dto.nom });
    return this.produitRepository.save(produit);
  }
}
