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
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(@Query() query: FindClientsQuery) {
    return this.clientsService.findAll(query);
  }

  @Get(':code_client')
  findOne(@Param('code_client') codeClient: string) {
    return this.clientsService.findOne(codeClient);
  }

  @Patch(':code_client')
  update(@Param('code_client') codeClient: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(codeClient, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
