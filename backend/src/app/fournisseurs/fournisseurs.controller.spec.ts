import { Test, TestingModule } from '@nestjs/testing';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';

describe('FournisseursController', () => {
  let controller: FournisseursController;

  const fournisseursServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FournisseursController],
      providers: [{ provide: FournisseursService, useValue: fournisseursServiceMock }],
    }).compile();

    controller = module.get<FournisseursController>(FournisseursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
