import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
     UsersGuilds,
     UsersGuildsSchema,
} from '../users_guilds/users_guilds.schema';
import { ChannelsController } from './channels.controller';
import { Channels, ChannelsSchema } from './channels.schema';
import { ChannelService } from './channels.service';

import { Guild, GuildSchema } from '@/controllers/guild/guild.schema';
import { GuildService } from '@/controllers/guild/guild.service';
import { Roles, RolesSchema } from '@/controllers/roles/roles.schema';

@Module({
     imports: [
          MongooseModule.forFeature([
               { name: Guild.name, schema: GuildSchema },
               { name: Channels.name, schema: ChannelsSchema },
               { name: Roles.name, schema: RolesSchema },
               { name: UsersGuilds.name, schema: UsersGuildsSchema },
          ]),
     ],
     controllers: [ChannelsController],
     providers: [ChannelService, GuildService],
})
export class ChannelsModule {}
