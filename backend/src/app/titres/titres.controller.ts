import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TitresService } from './titres.service';
import { CreateTitreDto } from './dto/create-titre.dto';
import { UpdateTitreDto } from './dto/update-titre.dto';

@Controller('titres')
export class TitresController {
  constructor(private readonly titresService: TitresService) {}

  @Post()
  create(@Body() createTitreDto: CreateTitreDto) {
    return this.titresService.create(createTitreDto);
  }

  @Get()
  findAll() {
    return this.titresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.titresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTitreDto: UpdateTitreDto) {
    return this.titresService.update(+id, updateTitreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.titresService.remove(+id);
  }
}
