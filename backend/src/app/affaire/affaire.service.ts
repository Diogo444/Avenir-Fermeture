import { Injectable } from '@nestjs/common';
import { CreateAffaireDto } from './dto/create-affaire.dto';
import { UpdateAffaireDto } from './dto/update-affaire.dto';

@Injectable()
export class AffaireService {
  create(createAffaireDto: CreateAffaireDto) {
    console.log(createAffaireDto);
    return 'This action adds a new affaire';
  }

  findAll() {
    return `This action returns all affaire`;
  }

  findOne(id: number) {
    return `This action returns a #${id} affaire`;
  }

  update(id: number, updateAffaireDto: UpdateAffaireDto) {
    console.log(updateAffaireDto);
    return `This action updates a #${id} affaire`;
  }

  remove(id: number) {
    return `This action removes a #${id} affaire`;
  }
}
