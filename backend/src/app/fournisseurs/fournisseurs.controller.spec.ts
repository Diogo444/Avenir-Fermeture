import { Test, TestingModule } from '@nestjs/testing';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';

describe('FournisseursController', () => {
  let controller: FournisseursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FournisseursController],
      providers: [FournisseursService],
    }).compile();

    controller = module.get<FournisseursController>(FournisseursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
