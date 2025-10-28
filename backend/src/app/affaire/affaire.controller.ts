import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AffaireService } from './affaire.service';
import { CreateAffaireDto } from './dto/create-affaire.dto';
import { UpdateAffaireDto } from './dto/update-affaire.dto';

@Controller('affaire')
export class AffaireController {
  constructor(private readonly affaireService: AffaireService) {}

  @Post()
  create(@Body() createAffaireDto: CreateAffaireDto) {
    return this.affaireService.create(createAffaireDto);
  }

  @Get()
  findAll() {
    return this.affaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.affaireService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAffaireDto: UpdateAffaireDto) {
    return this.affaireService.update(+id, updateAffaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affaireService.remove(+id);
  }
}
