import { UserGuildsService } from '@/users_guilds/users_guilds.service';
import { Controller, Inject, Post } from '@nestjs/common';
// import { Channel } from './channels.schema';
// import { ChannelService } from './channels.service';
import { Model } from 'mongoose';

@Controller('channels')
export class ChannelsController {
  constructor(
    @Inject(UserGuildsService) private userGuilds: UserGuildsService,
  ) {}
  @Post()
  async create() {
    console.log('CRWEATE');
  }
}
