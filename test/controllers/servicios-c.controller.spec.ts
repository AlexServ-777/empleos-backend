import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosCController } from '../../src/items/servicios/servicios-c.controller';

describe('ServiciosCController', () => {
  let controller: ServiciosCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosCController],
    }).compile();

    controller = module.get<ServiciosCController>(ServiciosCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
