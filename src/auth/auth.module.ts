import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { HttpStrategy } from '../Zconfigs/strategys/jwt.strategy';
import { GoogleStrategy } from '../Zconfigs/strategys/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import googleOauthConfig from '../Zconfigs/google-oauth.config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService,HttpStrategy,GoogleStrategy],
  imports:[
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([UsuarioEntity]),
    JwtModule.registerAsync({  
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>({
        secret: (configService.get<string>('JWT_SECRET')),
        signOptions: { expiresIn: process.env.JWT_EXPIRATION??"7d"}
      }), 
      inject:[ConfigService]
    }),//jwt config
    ConfigModule.forFeature(googleOauthConfig)
  ]
})
export class AuthModule {}
