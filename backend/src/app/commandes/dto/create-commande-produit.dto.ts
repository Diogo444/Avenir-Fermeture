import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommandeProduitDto {
  @Type(() => Number)
  @IsNumber()
  produitId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fournisseurId?: number | null;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantite: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  statusId?: number | null;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  avenant?: boolean;
}
