import { Test, TestingModule } from '@nestjs/testing';
import { CommandesController } from './commandes.controller';
import { CommandesService } from './commandes.service';

describe('CommandesController', () => {
  let controller: CommandesController;

  const commandesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandesController],
      providers: [{ provide: CommandesService, useValue: commandesServiceMock }],
    }).compile();

    controller = module.get<CommandesController>(CommandesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
