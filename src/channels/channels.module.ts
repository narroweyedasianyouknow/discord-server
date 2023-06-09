import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelsController } from './channels.controller';
import { ChannelService } from './channels.service';
import { Channels, ChannelsSchema } from './channels.schema';
import { GuildService } from '@/guild/guild.service';
import { Guild, GuildSchema } from '@/guild/guild.schema';
import {
  UsersChannels,
  UsersChannelsSchema,
} from '@/users_channels/users_channels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guild.name, schema: GuildSchema },
      { name: Channels.name, schema: ChannelsSchema },
      { name: UsersChannels.name, schema: UsersChannelsSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelService, GuildService],
})
export class ChannelsModule {}
