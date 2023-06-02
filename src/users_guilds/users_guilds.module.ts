import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UsersGuildsController from './users_guilds.controller';
import { UsersGuilds, UsersGuildsSchema } from './users_guilds.schema';
import { UserGuildsService } from './users_guilds.service';
import { Guild, GuildSchema } from 'src/guild/guild.schema';
import { GuildService } from 'src/guild/guild.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Guild.name, schema: GuildSchema },
    ]),
  ],
  controllers: [UsersGuildsController],
  providers: [UserGuildsService, GuildService],
})
export class UsersGuildsModule {}
