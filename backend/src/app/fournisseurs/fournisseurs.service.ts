import { Injectable } from '@nestjs/common';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';

@Injectable()
export class FournisseursService {
  create(createFournisseurDto: CreateFournisseurDto) {
    return 'This action adds a new fournisseur';
  }

  findAll() {
    return `This action returns all fournisseurs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fournisseur`;
  }

  update(id: number, updateFournisseurDto: UpdateFournisseurDto) {
    return `This action updates a #${id} fournisseur`;
  }

  remove(id: number) {
    return `This action removes a #${id} fournisseur`;
  }
}
