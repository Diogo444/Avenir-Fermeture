import { Test, TestingModule } from '@nestjs/testing';
import { ProduitsController } from './produits.controller';
import { ProduitsService } from './produits.service';

describe('ProduitsController', () => {
  let controller: ProduitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduitsController],
      providers: [ProduitsService],
    }).compile();

    controller = module.get<ProduitsController>(ProduitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
