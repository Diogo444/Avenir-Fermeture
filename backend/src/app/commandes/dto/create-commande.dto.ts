import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatutCommande, TypeAcompte } from '../commandes.types';
import { CreateCommandeProduitDto } from './create-commande-produit.dto';

export class CreateCommandeDto {
  @Type(() => Number)
  @IsNumber()
  clientId: number;

  @IsString()
  @IsNotEmpty()
  reference_commande: string;

  @IsString()
  @IsNotEmpty()
  numero_commande_interne: string;

  @IsOptional()
  @IsString()
  numero_devis?: string;

  @IsDateString()
  date_signature: string;

  @Type(() => Number)
  @IsNumber()
  montant_ht: number;

  @Type(() => Number)
  @IsNumber()
  montant_ttc: number;

  @IsEnum(TypeAcompte)
  type_acompte: TypeAcompte;

  @IsOptional()
  @IsEnum(StatutCommande)
  statut_commande?: StatutCommande;

  @IsOptional()
  @IsBoolean()
  permis_dp?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fournisseurId?: number | null;

  @IsOptional()
  @IsString()
  commentaires?: string;

  @IsOptional()
  @IsDateString()
  date_metre?: string;

  @IsOptional()
  @IsDateString()
  date_avenant?: string;

  @IsOptional()
  @IsDateString()
  date_limite_pose?: string;

  @IsOptional()
  @IsDateString()
  date_livraison_souhaitee?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommandeProduitDto)
  produits?: CreateCommandeProduitDto[];
}
