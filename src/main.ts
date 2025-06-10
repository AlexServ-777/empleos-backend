import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { cors } from './Zconfigs/CORS';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as fs from "fs";

async function bootstrap() {

  //config https
  const httpsOptions = {
    key: fs.readFileSync('./certificates/localhost-key.pem'),
    cert: fs.readFileSync('./certificates/localhost.pem'),
  };

  const app = await NestFactory.create(AppModule,{
    //httpsOptions,
  });
  const configService = app.get(ConfigService);

  // Configuración global de validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  

  app.use(morgan(':remote-addr - :method - :url - :status - :response-time ms'));
  app.enableCors(cors);

  app.use(cookieParser()); //para transformar el res en cookie del token csrf
  // Configuración CSRF
  app.use(csurf({
    cookie: {
      key: '_csrf',
      path: '/',
      httpOnly: false,
      secure: true,
      maxAge: 10800, // 3 hora
      sameSite: 'none'
    }
  }));

  // Manejador de errores CSRF
  app.use((err: any, req: any, res: any, next: any) => {
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({
        statusCode: 403,
        message: 'Token CSRF inválido o faltante',
        error: 'Forbidden'
      });
    }
    next(err);
  });

  app.setGlobalPrefix('api');
  
  await app.listen(configService.get('PORT')??"8000",'0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
