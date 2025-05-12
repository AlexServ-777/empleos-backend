import { Module } from '@nestjs/common';
import { ServiciosCController } from '../controllers/servicios-c.controller';
import { ServiciosSService } from '../services/servicios-s.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosEntity } from '../entidades/servicio.entity';
import { UsuarioEntity } from 'src/entidades/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ServiciosEntity,UsuarioEntity])],
  controllers: [ServiciosCController],
  providers: [ServiciosSService]
})
export class ServiciosModule {}
