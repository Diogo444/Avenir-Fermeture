import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateEtatProduitDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(7)
  couleur_hex: string;
}
