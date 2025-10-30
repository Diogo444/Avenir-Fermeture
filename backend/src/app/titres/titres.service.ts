import {Injectable } from '@nestjs/common';
import { CreateTitreDto } from './dto/create-titre.dto';
import { UpdateTitreDto } from './dto/update-titre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Titre } from './entities/titre.entity';

@Injectable()
export class TitresService {
  constructor(
    @InjectRepository(Titre)

    private readonly titreRepository: Repository<Titre>,
  ) {}
  create(createTitreDto: CreateTitreDto) {
    const titre = this.titreRepository.create(createTitreDto);
    return this.titreRepository.save(titre);
  }

  findAll() {
    return this.titreRepository.find();
  }

  findOne(id: number) {
    return this.titreRepository.findOneBy({ id });
  }

  update(id: number, updateTitreDto: UpdateTitreDto) {
    return this.titreRepository.update(id, updateTitreDto);
  }

  remove(id: number) {
    return this.titreRepository.delete(id);
  }
}
