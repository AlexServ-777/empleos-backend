import { Test, TestingModule } from '@nestjs/testing';
import { UsusariosSService } from '../../services/ususarios-s.service';

describe('UsusariosSService', () => {
  let service: UsusariosSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsusariosSService],
    }).compile();

    service = module.get<UsusariosSService>(UsusariosSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
