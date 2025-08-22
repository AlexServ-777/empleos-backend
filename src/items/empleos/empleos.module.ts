import { Module } from '@nestjs/common';
import { EmpleosCController } from './empleos.controller';
import { EmpleosSService } from './empleos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleosEntity } from './empleos.entity';
import { UsuarioEntity } from 'src/user/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EmpleosEntity, UsuarioEntity])],
  controllers: [EmpleosCController],
  providers: [EmpleosSService]
})
export class EmpleosModule {}
