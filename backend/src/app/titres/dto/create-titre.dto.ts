import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTitreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
