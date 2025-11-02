import { Test, TestingModule } from '@nestjs/testing';
import { FournisseursService } from './fournisseurs.service';

describe('FournisseursService', () => {
  let service: FournisseursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FournisseursService],
    }).compile();

    service = module.get<FournisseursService>(FournisseursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
