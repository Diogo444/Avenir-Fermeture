import { PartialType } from '@nestjs/mapped-types';
import { CreateAffaireDto } from './create-affaire.dto';

export class UpdateAffaireDto extends PartialType(CreateAffaireDto) {}
