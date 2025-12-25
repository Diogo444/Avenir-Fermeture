import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ){}
  create(createStatusDto: CreateStatusDto) {
    if (!createStatusDto?.name || `${createStatusDto.name}`.trim() === '') {
      throw new BadRequestException('name is required');
    }
    return this.statusRepository.save(createStatusDto);
  }

  findAll() {
    return this.statusRepository.find();
  }

  findOne(id: number) {
    return this.statusRepository.findOneBy({ id });
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return this.statusRepository.update(id, updateStatusDto);
  }

  remove(id: number) {
    return this.statusRepository.delete(id);
  }
}
