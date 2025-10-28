import { Test, TestingModule } from '@nestjs/testing';
import { AffaireService } from './affaire.service';

describe('AffaireService', () => {
  let service: AffaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffaireService],
    }).compile();

    service = module.get<AffaireService>(AffaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
