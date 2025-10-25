import { Test, TestingModule } from '@nestjs/testing';
import { CommercialService } from './commercial.service';

describe('CommercialService', () => {
  let service: CommercialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialService],
    }).compile();

    service = module.get<CommercialService>(CommercialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
