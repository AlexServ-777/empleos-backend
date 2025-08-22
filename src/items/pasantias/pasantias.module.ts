import { Module } from '@nestjs/common';
import { PasantiasCController } from './pasantias-c.controller';
import { PasantiasSService } from './pasantias-s.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasantiaEntity } from './pasantias.entity';
import { UsuarioEntity } from '../../user/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PasantiaEntity,UsuarioEntity])],
  controllers: [PasantiasCController],
  providers: [PasantiasSService]
})
export class PasantiasModule {}
