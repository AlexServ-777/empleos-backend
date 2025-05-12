import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioCController } from '../../controllers/usuarios-c.controller';

describe('UsuarioCController', () => {
  let controller: UsuarioCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioCController],
    }).compile();

    controller = module.get<UsuarioCController>(UsuarioCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
