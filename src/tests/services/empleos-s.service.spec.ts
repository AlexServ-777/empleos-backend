import { Test, TestingModule } from '@nestjs/testing';
import { EmpleosSService } from '../../services/empleos-s.service';

describe('EmpleosSService', () => {
  let service: EmpleosSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpleosSService],
    }).compile();

    service = module.get<EmpleosSService>(EmpleosSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
