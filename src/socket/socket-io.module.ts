import { Module } from '@nestjs/common';
import { SocketIoServer } from './socket-io.server';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/controllers/users_guilds/users_guilds.schema';
import {
  Channels,
  ChannelsSchema,
} from '@/controllers/channels/channels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Channels.name, schema: ChannelsSchema },
    ]),
  ],
  providers: [SocketIoServer],
})
export class SocketIOModule {}
