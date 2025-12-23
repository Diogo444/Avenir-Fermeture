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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindClientsQuery } from './dto/find-clients.query';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.create(createClientDto);
  }

  @Get()
  async findAll(@Query() query: FindClientsQuery) {
    return await this.clientsService.findAll(query);
  }

  @Get(':code_client')
  async findOne(@Param('code_client') codeClient: string) {
    return await this.clientsService.findOne(codeClient);
  }

  @Patch(':code_client')
  async update(@Param('code_client') codeClient: string, @Body() updateClientDto: UpdateClientDto) {
    return await this.clientsService.update(codeClient, updateClientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.clientsService.remove(+id);
  }
}
