import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuildController } from './guild.controller';
import { Guild, GuildSchema } from './guild.schema';
import { GuildService } from './guild.service';

import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/controllers/users_guilds/users_guilds.schema';
import {
  Channels,
  ChannelsSchema,
} from '@/controllers/channels/channels.schema';
import { ChannelService } from '@/controllers/channels/channels.service';
import { Roles, RolesSchema } from '@/controllers/roles/roles.schema';
import { UserGuildsService } from '@/controllers/users_guilds/users_guilds.service';

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
  providers: [UserGuildsService, GuildService, ChannelService],
})
export class GuildModule {}
