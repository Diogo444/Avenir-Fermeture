import { Test, TestingModule } from '@nestjs/testing';
import { CommandesService } from './commandes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Commande } from './entities/commande.entity';
import { CommandeProduit } from './entities/commandeProduit.entity';
import { Client } from '../clients/entities/client.entity';
import { Produit } from '../produits/entities/produit.entity';
import { EtatProduit } from '../etatProduit/entities/etat-produit.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';

describe('CommandesService', () => {
  let service: CommandesService;

  const repositoryMock = {
    findOne: jest.fn(),
    find: jest.fn(),
    findBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandesService,
        { provide: getRepositoryToken(Commande), useValue: repositoryMock },
        { provide: getRepositoryToken(CommandeProduit), useValue: repositoryMock },
        { provide: getRepositoryToken(Client), useValue: repositoryMock },
        { provide: getRepositoryToken(Produit), useValue: repositoryMock },
        { provide: getRepositoryToken(EtatProduit), useValue: repositoryMock },
        { provide: getRepositoryToken(Fournisseur), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<CommandesService>(CommandesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
