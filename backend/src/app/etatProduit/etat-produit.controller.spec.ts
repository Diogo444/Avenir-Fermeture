import { Test, TestingModule } from '@nestjs/testing';
import { EtatProduitController } from './etat-produit.controller';
import { EtatProduitService } from './etat-produit.service';

describe('EtatProduitController', () => {
  let controller: EtatProduitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtatProduitController],
      providers: [EtatProduitService],
    }).compile();

    controller = module.get<EtatProduitController>(EtatProduitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
