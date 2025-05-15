import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { cors } from './Zconfigs/CORS';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan(':remote-addr - :method - :url - :status - :response-time ms'));
  app.enableCors(cors);
  app.setGlobalPrefix('api');
  
  await app.listen(8000);
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
