import { Test, TestingModule } from '@nestjs/testing';
import { EmpleosCController } from '../../src/items/empleos/empleos.controller';

describe('EmpleosCController', () => {
  let controller: EmpleosCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpleosCController],
    }).compile();

    controller = module.get<EmpleosCController>(EmpleosCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
