import { Test, TestingModule } from '@nestjs/testing';
import { TitresService } from './titres.service';

describe('TitresService', () => {
  let service: TitresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitresService],
    }).compile();

    service = module.get<TitresService>(TitresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
