import { Module } from '@nestjs/common';
import { EmpleosCController } from '../controllers/empleos-c.controller';
import { EmpleosSService } from '../services/empleos-s.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { UsuarioEntity } from 'src/entidades/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EmpleosEntity, UsuarioEntity])],
  controllers: [EmpleosCController],
  providers: [EmpleosSService]
})
export class EmpleosModule {}
