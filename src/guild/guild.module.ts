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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guild.name, schema: GuildSchema },
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
    ]),
  ],
  controllers: [GuildController],
  providers: [GuildService, UserGuildsService],
})
export class GuildModule {}
