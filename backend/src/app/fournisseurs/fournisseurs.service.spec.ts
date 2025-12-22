import { Test, TestingModule } from '@nestjs/testing';
import { FournisseursService } from './fournisseurs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fournisseur } from './entities/fournisseur.entity';

describe('FournisseursService', () => {
  let service: FournisseursService;

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
        FournisseursService,
        { provide: getRepositoryToken(Fournisseur), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<FournisseursService>(FournisseursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
