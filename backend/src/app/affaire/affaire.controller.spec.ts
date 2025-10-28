import { Test, TestingModule } from '@nestjs/testing';
import { AffaireController } from './affaire.controller';
import { AffaireService } from './affaire.service';

describe('AffaireController', () => {
  let controller: AffaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffaireController],
      providers: [AffaireService],
    }).compile();

    controller = module.get<AffaireController>(AffaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
