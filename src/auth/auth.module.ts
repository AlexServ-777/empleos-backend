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
import { Forgot_Password_Entity } from '../entidades/forgot-password.entity';
import { Resend } from 'resend';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    HttpStrategy,
    GoogleStrategy, 
    Resend,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    } //throttle lo hace global para el controlador y para que algunos endpoints no sean afectados poner @SkypThrottle()
  ],
  imports:[
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([UsuarioEntity, Forgot_Password_Entity]),
    JwtModule.registerAsync({  
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>({
        secret: (configService.get<string>('JWT_SECRET')),
        signOptions: { expiresIn: process.env.JWT_EXPIRATION??"7d"}
      }), 
      inject:[ConfigService]
    }),//jwt config
    ThrottlerModule.forRoot({ //asigna la config de rate limits al controlador
      throttlers: [{
        ttl: 900000,
        limit: 5
      }]
    }),
    ConfigModule.forFeature(googleOauthConfig),
  ]
})
export class AuthModule {}
