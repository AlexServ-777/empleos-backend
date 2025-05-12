import { Module } from '@nestjs/common';
import { PasantiasCController } from '../controllers/pasantias-c.controller';
import { PasantiasSService } from '../services/pasantias-s.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { UsuarioEntity } from '../entidades/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PasantiaEntity,UsuarioEntity])],
  controllers: [PasantiasCController],
  providers: [PasantiasSService]
})
export class PasantiasModule {}
