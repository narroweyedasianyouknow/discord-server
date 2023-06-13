import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuildController } from './guild.controller';
import { Guild, GuildSchema } from './guild.schema';
import { GuildService } from './guild.service';

import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/users_guilds/users_guilds.schema';
import { UserGuildsService } from '@/users_guilds/users_guilds.service';
import { Channels, ChannelsSchema } from '@/channels/channels.schema';
import { ChannelService } from '@/channels/channels.service';
import { Roles, RolesSchema } from '@/roles/roles.schema';
import { SocketStore } from '@/SocketStore';
import { SocketIoServer } from '@/socket-io.server';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guild.name, schema: GuildSchema },
      { name: Channels.name, schema: ChannelsSchema },
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Roles.name, schema: RolesSchema },
    ]),
  ],
  controllers: [GuildController],
  providers: [GuildService, UserGuildsService, ChannelService, SocketIoServer],
})
export class GuildModule {}
