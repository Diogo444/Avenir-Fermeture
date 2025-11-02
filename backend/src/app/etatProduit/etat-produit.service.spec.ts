import { Test, TestingModule } from '@nestjs/testing';
import { EtatProduitService } from './etat-produit.service';

describe('EtatProduitService', () => {
  let service: EtatProduitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtatProduitService],
    }).compile();

    service = module.get<EtatProduitService>(EtatProduitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
