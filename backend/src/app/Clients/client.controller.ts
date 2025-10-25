import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  // utiliser la méthode findAll du service pour récupérer tous les clients
  async findAll() {
    return this.clientService.findAll();
  }

  @Post('create')
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  // delete client by id
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.clientService.delete(id);
  }
}

