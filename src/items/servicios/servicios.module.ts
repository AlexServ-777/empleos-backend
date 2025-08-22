import { Module } from '@nestjs/common';
import { ServiciosCController } from './servicios-c.controller';
import { ServiciosSService } from './servicios-s.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosEntity } from './servicio.entity';
import { UsuarioEntity } from 'src/user/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiciosEntity,UsuarioEntity])],
  controllers: [ServiciosCController],
  providers: [ServiciosSService]
})
export class ServiciosModule {}
