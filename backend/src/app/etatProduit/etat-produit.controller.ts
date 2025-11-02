import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EtatProduitService } from './etat-produit.service';
import { CreateEtatProduitDto } from './dto/create-etat-produit.dto';
import { UpdateEtatProduitDto } from './dto/update-etat-produit.dto';

@Controller('etat-produit')
export class EtatProduitController {
  constructor(private readonly etatProduitService: EtatProduitService) {}

  @Post()
  create(@Body() createEtatProduitDto: CreateEtatProduitDto) {
    return this.etatProduitService.create(createEtatProduitDto);
  }

  @Get()
  findAll() {
    return this.etatProduitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.etatProduitService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEtatProduitDto: UpdateEtatProduitDto
  ) {
    return this.etatProduitService.update(+id, updateEtatProduitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.etatProduitService.remove(+id);
  }
}
