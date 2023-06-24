import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import AppController from './app.controller';
import { multerOptions } from './multer';
import { SocketGateway } from './socket/socket.gateway';

import { ChannelsModule } from '@/controllers/channels/channels.module';
import {
     Channels,
     ChannelsSchema,
} from '@/controllers/channels/channels.schema';
import { FilesController } from '@/controllers/files/files.controller';
import { GuildModule } from '@/controllers/guild/guild.module';
import { InvitesModule } from '@/controllers/invites/invites.module';
import { MessageModule } from '@/controllers/messages/message.module';
import { PersonModule } from '@/controllers/person/person.module';
import { UsersGuildsModule } from '@/controllers/users_guilds/users_guilds.module';
import {
     UsersGuilds,
     UsersGuildsSchema,
} from '@/controllers/users_guilds/users_guilds.schema';
import { SocketStoreModule } from '@/socketStore/socketStore.module';

@Module({
     imports: [
          ConfigModule.forRoot({ isGlobal: true }),
          ServeStaticModule.forRoot({
               rootPath: join(__dirname, '..', 'static'),
          }),
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
          SocketStoreModule,
          InvitesModule,
     ],
     controllers: [FilesController, AppController],
     providers: [SocketGateway],
})
export class AppModule {
     // TODO AuthMiddleware
     // implements NestModule {
     //      configure(consumer: MiddlewareConsumer) {
     //           consumer
     //                .apply(LoggerMiddleware)
     //                .forRoutes([FilesController, AppController]);
     //      }
     // }
}
