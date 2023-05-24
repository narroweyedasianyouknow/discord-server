import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketIoServer } from './socket-io.server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer();
  const socketIoServer = app.get(SocketIoServer);
  socketIoServer.configure(server);

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:1500', 'http://localhost:5173'],
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
