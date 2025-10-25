import { Injectable } from '@nestjs/common';
import { CreateCommercialDto } from './dto/create-commercial.dto';
import { UpdateCommercialDto } from './dto/update-commercial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commercial } from './entities/commercial.entity';

@Injectable()
export class CommercialService {
  constructor(
    @InjectRepository(Commercial)
    private readonly commercialRepository: Repository<Commercial>,
  ) {}
  create(createCommercialDto: CreateCommercialDto) {
    const commercial = this.commercialRepository.create(createCommercialDto);
    return this.commercialRepository.save(commercial);
  }

  findAll() {
    return this.commercialRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} commercial`;
  }

  update(id: number, updateCommercialDto: UpdateCommercialDto) {
    return this.commercialRepository.update(id, updateCommercialDto);
  }

  remove(id: number) {
    return this.commercialRepository.delete(id);
  }
}
