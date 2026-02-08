import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFournisseurDto {
  @IsString()
  @IsNotEmpty()
  nom: string;
}
