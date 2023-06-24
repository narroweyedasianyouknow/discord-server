import {
      Body,
      Controller,
      HttpCode,
      HttpException,
      HttpStatus,
      Inject,
      Param,
      Post,
      Put,
} from '@nestjs/common';

import { ChannelType, CHANNEL_TYPES_LIST } from './channels';
import { ChannelService } from './channels.service';

import { Profile } from '@/decorators/Profile';
import { SocketStore } from '@/socketStore/SocketStore';

@Controller('channels')
export class ChannelsController {
      constructor(
            @Inject(ChannelService) private channel: ChannelService,
            @Inject(SocketStore) private socketStore: SocketStore,
      ) {}
      // @Inject(UserGuildsService) private userGuilds: UserGuildsService,

      private defaultValue: ChannelType = {
            channel_type: CHANNEL_TYPES_LIST.GUILD_TEXT,
            permission_overwrites: [],
            nsfw: false,
            recipients: [],
            guild_id: undefined,
            position: undefined,
            name: undefined,
            topic: undefined,
            last_message_id: undefined,
            bitrate: undefined,
            user_limit: undefined,
            rate_limit_per_user: undefined,
            icon: undefined,
            owner_id: undefined,
            parent_id: undefined,
            last_pin_timestamp: undefined,
            rtc_region: undefined,
            video_quality_mode: undefined,
            message_count: undefined,
            member_count: 0,
            default_auto_archive_duration: undefined,
            permissions: undefined,
            flags: undefined,
            total_message_sent: 0,
      };

      @Post('create')
      @HttpCode(201)
      async create(@Body() body: ChannelType, @Profile() user: CookieProfile) {
            const create = await this.channel.create(
                  { ...this.defaultValue, ...body },
                  user.user_id,
            );
            if (!create) {
                  throw new HttpException(
                        'Error! Cannot create guild',
                        HttpStatus.BAD_REQUEST,
                  );
            }

            const socket = this.socketStore.getUserSocket(user.user_id);
            socket?.join(create.id);
            return {
                  response: create,
            };
      }
      @Put(':parent_id/update')
      @HttpCode(204)
      async update(
            @Param('parent_id') parent_id: string,
            @Body() body: ChannelType & { id: string },
            @Profile() user: CookieProfile,
      ) {
            const update = await this.channel.update(
                  parent_id,
                  body,
                  user.user_id,
            );

            if (!update) {
                  throw new HttpException(
                        'Error! Cannot update guild',
                        HttpStatus.BAD_REQUEST,
                  );
            }
      }
}
