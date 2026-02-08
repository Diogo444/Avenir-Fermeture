import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommercialDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
