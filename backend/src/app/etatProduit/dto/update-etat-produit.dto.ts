import { PartialType } from '@nestjs/mapped-types';
import { CreateEtatProduitDto } from './create-etat-produit.dto';

export class UpdateEtatProduitDto extends PartialType(CreateEtatProduitDto) {}
