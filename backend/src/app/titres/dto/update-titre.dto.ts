import { PartialType } from '@nestjs/mapped-types';
import { CreateTitreDto } from './create-titre.dto';

export class UpdateTitreDto extends PartialType(CreateTitreDto) {}
