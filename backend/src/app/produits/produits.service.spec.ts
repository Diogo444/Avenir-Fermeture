import { Test, TestingModule } from '@nestjs/testing';
import { ProduitsService } from './produits.service';
import { beforeEach, describe, it } from 'node:test';
import { expect } from '@jest/globals';

describe('ProduitsService', () => {
  let service: ProduitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduitsService],
    }).compile();

    service = module.get<ProduitsService>(ProduitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
