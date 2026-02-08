import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';
import { Fournisseur } from './entities/fournisseur.entity';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectRepository(Fournisseur)
    private readonly fournisseurRepository: Repository<Fournisseur>,
  ) {}

  create(createFournisseurDto: CreateFournisseurDto) {
    const fournisseur = this.fournisseurRepository.create(createFournisseurDto);
    return this.fournisseurRepository.save(fournisseur);
  }

  findAll() {
    return this.fournisseurRepository.find();
  }

  findOne(id: number) {
    return this.fournisseurRepository.findOneBy({ id });
  }

  update(id: number, updateFournisseurDto: UpdateFournisseurDto) {
    return this.fournisseurRepository.update(id, updateFournisseurDto);
  }

  remove(id: number) {
    return this.fournisseurRepository.delete(id);
  }
}
