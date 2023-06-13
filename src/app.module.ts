import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SocketStore } from './SocketStore';
import { AvatarController } from './avatar/avatar.controller';
import { GuildModule } from './guild/guild.module';
import { multerOptions } from './multer';
import { PersonModule } from './person/person.module';
import { PostgreSQL } from './postgres';
import { UsersGuildsModule } from './users_guilds/users_guilds.module';
import {
  UsersGuilds,
  UsersGuildsSchema,
} from './users_guilds/users_guilds.schema';
import { SocketIoServer } from './socket-io.server';
import { ChannelsModule } from './channels/channels.module';
import AppController from './app.controller';
import { MessageModule } from './messages/message.module';
import { Channels, ChannelsSchema } from './channels/channels.schema';

// const controllers = [];
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static') }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      useUnifiedTopology: true,
      autoIndex: true,
      dbName: 'discord',
    }),
    MongooseModule.forFeature([
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Channels.name, schema: ChannelsSchema },
    ]),
    MulterModule.register(multerOptions),
    PersonModule,
    GuildModule,
    UsersGuildsModule,
    ChannelsModule,
    MessageModule,
  ],
  controllers: [AvatarController, AppController],
  providers: [SocketIoServer, SocketStore],
})
export class AppModule {}
// export class AppModule implements NestModule {
// configure(consumer: MiddlewareConsumer) {
//   consumer.apply(LoggerMiddleware).forRoutes(...controllers);
// }
// }
