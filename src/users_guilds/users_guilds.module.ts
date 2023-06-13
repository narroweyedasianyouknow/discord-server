import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UsersGuildsController from './users_guilds.controller';
import { UsersGuilds, UsersGuildsSchema } from './users_guilds.schema';
import { UserGuildsService } from './users_guilds.service';
import { Guild, GuildSchema } from '@/guild/guild.schema';
import { Channels, ChannelsSchema } from '@/channels/channels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Guild.name, schema: GuildSchema },
      { name: Channels.name, schema: ChannelsSchema },
    ]),
  ],
  controllers: [UsersGuildsController],
  providers: [UserGuildsService],
})
export class UsersGuildsModule {}
