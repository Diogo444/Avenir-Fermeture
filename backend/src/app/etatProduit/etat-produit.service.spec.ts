import { Test, TestingModule } from '@nestjs/testing';
import { EtatProduitService } from './etat-produit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EtatProduit } from './entities/etat-produit.entity';

describe('EtatProduitService', () => {
  let service: EtatProduitService;

  const repositoryMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EtatProduitService,
        { provide: getRepositoryToken(EtatProduit), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<EtatProduitService>(EtatProduitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
