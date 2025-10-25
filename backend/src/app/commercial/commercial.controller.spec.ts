import { Test, TestingModule } from '@nestjs/testing';
import { CommercialController } from './commercial.controller';
import { CommercialService } from './commercial.service';

describe('CommercialController', () => {
  let controller: CommercialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialController],
      providers: [CommercialService],
    }).compile();

    controller = module.get<CommercialController>(CommercialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
