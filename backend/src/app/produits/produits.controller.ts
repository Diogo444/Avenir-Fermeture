import { Body, Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './DTO/create-produit.dto';

@Controller('produits')
export class ProduitsController {
  constructor(private readonly produitsService: ProduitsService){}

  @Get()
  findAll() {
    return this.produitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produitsService.findOne(id);
  }

@Post()
create(@Body() produitDto: CreateProduitDto) {
  return this.produitsService.create(produitDto);
}

}
