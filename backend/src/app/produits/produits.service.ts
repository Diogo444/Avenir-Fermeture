import { Injectable } from '@nestjs/common';
import { CreateProduitDto } from './DTO/create-produit.dto';
import { UpdateProduitDto } from './DTO/update-produit.dto';
import { Produit } from './entities/produit.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProduitsService {

  constructor(
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
  ) {}

  create(createProduitDto: CreateProduitDto) {
    const produit = this.produitRepository.create(createProduitDto);
    return this.produitRepository.save(produit);
  }

  findAll() {
    return this.produitRepository.find();
  }

  findOne(id: number) {
    return this.produitRepository.findOneBy({ id });
  }

  update(id: number, updateProduitDto: UpdateProduitDto) {
    return this.produitRepository.update(id, updateProduitDto);
  }

  remove(id: number) {
    return this.produitRepository.delete(id);
  }
}
