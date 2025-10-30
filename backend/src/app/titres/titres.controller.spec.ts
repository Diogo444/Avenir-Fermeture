import { Test, TestingModule } from '@nestjs/testing';
import { TitresController } from './titres.controller';
import { TitresService } from './titres.service';

describe('TitresController', () => {
  let controller: TitresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TitresController],
      providers: [TitresService],
    }).compile();

    controller = module.get<TitresController>(TitresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
