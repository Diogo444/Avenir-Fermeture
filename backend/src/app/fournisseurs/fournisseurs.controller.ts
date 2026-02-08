import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';

@Controller('fournisseurs')
export class FournisseursController {
  constructor(private readonly fournisseursService: FournisseursService) {}

  @Post()
  create(@Body() dto: CreateFournisseurDto) {
    return this.fournisseursService.create(dto);
  }

  @Get()
  findAll() {
    return this.fournisseursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fournisseursService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFournisseurDto: UpdateFournisseurDto
  ) {
    return this.fournisseursService.update(+id, updateFournisseurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fournisseursService.remove(+id);
  }
}
