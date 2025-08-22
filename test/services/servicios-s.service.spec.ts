import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosSService } from '../../src/items/servicios/servicios-s.service';

describe('ServiciosSService', () => {
  let service: ServiciosSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiciosSService],
    }).compile();

    service = module.get<ServiciosSService>(ServiciosSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
