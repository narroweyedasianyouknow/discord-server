import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { FoldersController } from './folders/folders.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileController } from './profile/profile.controller';
import { PostgreSQL } from './postgres';
import { SocketIoServer } from './socket-io.server';
import { MessageController } from './messages/message.controller';
import { ChatsController } from './chats/chats.controller';
const controllers = [
  FoldersController,
  ProfileController,
  MessageController,
  ChatsController,
];
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static') }),
  ],
  controllers: [AuthController, ...controllers],
  providers: [SocketIoServer, PostgreSQL],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(...controllers);
  }
}
