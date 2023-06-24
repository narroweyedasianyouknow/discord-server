import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
      const app = await NestFactory.create(AppModule);

      app.enableCors({
            credentials: true,
            origin: ['http://localhost:1500', 'http://localhost:5173'],
      });
      app.use(cookieParser());
      app.use(bodyParser.json({ limit: '10mb' }));
      app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
      await app.listen(3000);
}
bootstrap();
