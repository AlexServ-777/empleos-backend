import { Test, TestingModule } from '@nestjs/testing';
import { PasantiasSService } from '../../services/pasantias-s.service';

describe('PasantiasSService', () => {
  let service: PasantiasSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasantiasSService],
    }).compile();

    service = module.get<PasantiasSService>(PasantiasSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
