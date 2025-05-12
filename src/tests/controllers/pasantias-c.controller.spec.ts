import { Test, TestingModule } from '@nestjs/testing';
import { PasantiasCController } from '../../controllers/pasantias-c.controller';

describe('PasantiasCController', () => {
  let controller: PasantiasCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasantiasCController],
    }).compile();

    controller = module.get<PasantiasCController>(PasantiasCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
