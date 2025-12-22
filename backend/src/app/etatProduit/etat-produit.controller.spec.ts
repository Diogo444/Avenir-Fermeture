import { Test, TestingModule } from '@nestjs/testing';
import { EtatProduitController } from './etat-produit.controller';
import { EtatProduitService } from './etat-produit.service';

describe('EtatProduitController', () => {
  let controller: EtatProduitController;

  const etatProduitServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtatProduitController],
      providers: [{ provide: EtatProduitService, useValue: etatProduitServiceMock }],
    }).compile();

    controller = module.get<EtatProduitController>(EtatProduitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
