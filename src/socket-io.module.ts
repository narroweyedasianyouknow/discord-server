import { Module } from '@nestjs/common';
import { SocketIoServer } from './socket-io.server';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketStore } from './SocketStore';
import {
  UsersGuilds,
  UsersGuildsSchema,
} from './users_guilds/users_guilds.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
    ]),
  ],
  providers: [SocketIoServer, SocketStore],
})
export class SocketIOModule {}
