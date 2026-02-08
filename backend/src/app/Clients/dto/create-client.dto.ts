import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  code_client: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  titleId?: number | null;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone_1_label?: string;

  @IsOptional()
  @IsString()
  phone_1?: string | null;

  @IsOptional()
  @IsString()
  phone_2_label?: string;

  @IsOptional()
  @IsString()
  phone_2?: string | null;

  @IsOptional()
  @IsString()
  phone_3_label?: string;

  @IsOptional()
  @IsString()
  phone_3?: string | null;

  @IsOptional()
  @IsString()
  rue?: string;

  @IsOptional()
  @IsString()
  code_postal?: string;

  @IsOptional()
  @IsString()
  ville?: string;
}
