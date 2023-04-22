import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { FoldersController } from './folders/folders.controller';
import { TasksController } from './tasks/tasks.controller';
import { AppGateway } from './app/app.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileController } from './profile/profile.controller';
const controllers = [FoldersController, TasksController, ProfileController];
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static') }),
  ],
  controllers: [AppController, AuthController, ...controllers],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(...controllers);
  }
}
