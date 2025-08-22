import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioCController } from './usuarios.controller';
import { UsusariosSService } from './usuarios.service';
import { UsuarioEntity } from './usuarios.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpStrategy } from '../auth/auth_config/jwt.strategy';
import { EmpleosEntity } from '../items/empleos/empleos.entity';
import { PasantiaEntity } from '../items/pasantias/pasantias.entity';
import { ServiciosEntity } from '../items/servicios/servicio.entity';
import { FavoritosEntity } from './relations/favorites/favoritos.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import googleOauthConfig from '../auth/google_config/google-oauth.config';
import { ReportsController } from '@/user/relations/reports/reports.controller';
import { ReportsService } from '@/user/relations/reports/reports.service';
import { ReportesEntity } from '@/user/relations/reports/reports.entity';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UsuarioEntity,EmpleosEntity,PasantiaEntity, ServiciosEntity,FavoritosEntity, ReportesEntity]), //entidades
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
  controllers: [UsuarioCController, ReportsController],
  providers: [UsusariosSService, ReportsService,HttpStrategy],
})
export class UsuariosModule { }
