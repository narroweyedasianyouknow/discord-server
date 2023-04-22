import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:1500', 'http://localhost:5173'],
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
