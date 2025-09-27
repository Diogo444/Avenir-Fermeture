import { Controller, Get } from '@nestjs/common';
import { ProduitsService } from './produits.service';

@Controller('produits')
export class ProduitsController {
  constructor(private readonly produitsService: ProduitsService){}

  @Get()
  findAll() {
    return this.produitsService.findAll();
  }

}
