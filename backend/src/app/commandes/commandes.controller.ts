import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { FindCommandesQuery } from './dto/find-commandes.query';

@Controller('commandes')
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @Post()
  create(@Body() createCommandeDto: CreateCommandeDto) {
    return this.commandesService.create(createCommandeDto);
  }

  @Get()
  findAll(@Query() query: FindCommandesQuery) {
    return this.commandesService.findAll(query);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.commandesService.findByClientId(+clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandeDto: UpdateCommandeDto
  ) {
    return this.commandesService.update(+id, updateCommandeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandesService.remove(+id);
  }
}
