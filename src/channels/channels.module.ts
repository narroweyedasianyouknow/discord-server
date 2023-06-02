import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelsController } from './channels.controller';
import { ChannelService } from './channels.service';
import { Channels, ChannelsSchema } from './channels.schema';
import { GuildService } from '@/guild/guild.service';
import { Guild, GuildSchema } from '@/guild/guild.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guild.name, schema: GuildSchema },
      { name: Channels.name, schema: ChannelsSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelService, GuildService],
})
export class ChannelsModule {}
