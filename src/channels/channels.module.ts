import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/users_guilds/users_guilds.schema';
import { UserGuildsService } from '@/users_guilds/users_guilds.service';
import { ChannelsController } from './channels.controller';
import { Channels, ChannelsSchema } from './channels.schema';
// import { ChannelService } from './channels.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Channels.name, schema: ChannelsSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [UserGuildsService],
})
export class ChannelsModule {}
