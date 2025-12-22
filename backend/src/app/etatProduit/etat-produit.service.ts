import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEtatProduitDto } from './dto/create-etat-produit.dto';
import { UpdateEtatProduitDto } from './dto/update-etat-produit.dto';
import { EtatProduit } from './entities/etat-produit.entity';

@Injectable()
export class EtatProduitService {
  constructor(
    @InjectRepository(EtatProduit)
    private readonly etatProduitRepository: Repository<EtatProduit>,
  ) {}

  create(createEtatProduitDto: CreateEtatProduitDto) {
    const etat = this.etatProduitRepository.create(createEtatProduitDto);
    return this.etatProduitRepository.save(etat);
  }

  findAll() {
    return this.etatProduitRepository.find();
  }

  findOne(id: number) {
    return this.etatProduitRepository.findOneBy({ id });
  }

  update(id: number, updateEtatProduitDto: UpdateEtatProduitDto) {
    return this.etatProduitRepository.update(id, updateEtatProduitDto);
  }

  remove(id: number) {
    return this.etatProduitRepository.delete(id);
  }
}
