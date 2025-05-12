import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioCController } from '../controllers/usuarios-c.controller';
import { UsusariosSService } from '../services/ususarios-s.service';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../Zconfigs/jwtConstants';
import { PassportModule } from '@nestjs/passport';
import { HttpStrategy } from '../Zconfigs/jwt.strategy';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { ServiciosEntity } from '../entidades/servicio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity,EmpleosEntity,PasantiaEntity, ServiciosEntity]),
    PassportModule,
    //registro de mi clave secreta de jwt
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' }
    })],
  controllers: [UsuarioCController],
  providers: [UsusariosSService,HttpStrategy],
})
export class UsuariosModule { }
