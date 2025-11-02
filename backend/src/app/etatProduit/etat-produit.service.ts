import { Injectable } from '@nestjs/common';
import { CreateEtatProduitDto } from './dto/create-etat-produit.dto';
import { UpdateEtatProduitDto } from './dto/update-etat-produit.dto';

@Injectable()
export class EtatProduitService {
  create(createEtatProduitDto: CreateEtatProduitDto) {
    return 'This action adds a new etatProduit';
  }

  findAll() {
    return `This action returns all etatProduit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} etatProduit`;
  }

  update(id: number, updateEtatProduitDto: UpdateEtatProduitDto) {
    return `This action updates a #${id} etatProduit`;
  }

  remove(id: number) {
    return `This action removes a #${id} etatProduit`;
  }
}
