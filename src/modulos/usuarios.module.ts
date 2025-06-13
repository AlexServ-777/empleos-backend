import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioCController } from '../controllers/usuarios-c.controller';
import { UsusariosSService } from '../services/ususarios-s.service';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpStrategy } from '../Zconfigs/strategys/jwt.strategy';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { ServiciosEntity } from '../entidades/servicio.entity';
import { FavoritosEntity } from '../entidades/favoritos.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import googleOauthConfig from '../Zconfigs/google-oauth.config';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UsuarioEntity,EmpleosEntity,PasantiaEntity, ServiciosEntity,FavoritosEntity]), //entidades
    PassportModule, //passport librarie import
    JwtModule.registerAsync({  
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>({
        secret: (configService.get<string>('JWT_SECRET')),
        signOptions: { expiresIn: process.env.JWT_EXPIRATION??"7d"}
      }), 
      inject:[ConfigService]
    }),//jwt config
    ConfigModule.forFeature(googleOauthConfig), //config googleauthConfig
  ],
  controllers: [UsuarioCController],
  providers: [UsusariosSService,HttpStrategy],
})
export class UsuariosModule { }
