import {
      Body,
      Controller,
      Delete,
      Get,
      HttpCode,
      HttpException,
      HttpStatus,
      Inject,
      Post,
} from '@nestjs/common';

import {
      DEFAULT_MESSAGE_NOTIFICATIONS_LEVEL,
      EXPLICIT_CONTENT_LEVEL,
      MFA_LEVEL,
      NSFW_LEVEL,
      SYSTEM_CHANNEL_FLAGS,
      VERIFICATION_LEVEL,
} from './guild.schema';
import type { GuildType } from './guild.schema';
import { GuildService } from './guild.service';

import {
      DEFAULT_PERMISSION,
      UserGuildsService,
} from '@/controllers/users_guilds/users_guilds.service';
import { Profile } from '@/decorators/Profile';
import { SocketStore } from '@/socketStore/SocketStore';

@Controller('guild')
export class GuildController {
      constructor(
            @Inject(UserGuildsService)
            private userGuilds: UserGuildsService,
            @Inject(GuildService) private guild: GuildService,
            @Inject(SocketStore) private socketStore: SocketStore,
      ) {}
      expiresAge = () => {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date;
      };

      private defaultValue = {
            id: '',
            name: '',
            owner_id: '',
            afk_timeout: 0,
            verification_level: VERIFICATION_LEVEL.NONE,
            default_message_notifications:
                  DEFAULT_MESSAGE_NOTIFICATIONS_LEVEL.ALL_MESSAGES,
            explicit_content_filter: EXPLICIT_CONTENT_LEVEL.ALL_MEMBERS,
            roles: [],
            emojis: [],
            features: [],
            mfa_level: MFA_LEVEL.NONE,
            application_id: '',
            system_channel_id: '',
            system_channel_flags:
                  SYSTEM_CHANNEL_FLAGS.SUPPRESS_JOIN_NOTIFICATIONS,
            rules_channel_id: '',
            premium_tier: 0,
            preferred_locale: '',
            nsfw_level: NSFW_LEVEL.DEFAULT,
            premium_progress_bar_enabled: false,
      };

      @Post('/create')
      @HttpCode(201)
      async create(
            @Body()
            body: {
                  name: string;
                  avatar?: string;
            },
            @Profile() user: CookieProfile,
      ) {
            const { name, avatar } = body;
            const value: GuildType = {
                  ...this.defaultValue,
                  name: name,
                  owner_id: user.user_id,
                  icon: avatar,
            };
            const createGuild = await this.guild.create(value);

            await this.userGuilds.create({
                  user_id: user.user_id,
                  guild_id: createGuild.id,
                  permissions: DEFAULT_PERMISSION,
            });

            const socket = this.socketStore.getUserSocket(user.user_id);
            const channelIds = createGuild.channels.map((v) => {
                  return String(v.id);
            });
            socket?.join(channelIds);
            return {
                  response: createGuild,
            };
      }

      @Get('/my')
      @HttpCode(200)
      async get(@Profile() user: CookieProfile) {
            const requestError = new HttpException(
                  'Error! Cannot get guilds list',
                  HttpStatus.BAD_REQUEST,
            );
            const myGuilds = await this.userGuilds.findMyGuilds(user.user_id);
            if (!myGuilds) throw requestError;

            const list = await this.guild.findGuildsList(myGuilds);
            if (!list) throw requestError;

            return {
                  response: list,
            };
      }

      @Delete('/remove')
      @HttpCode(204)
      async delete(
            @Body('guild_id') guild_id: string,
            @Profile() user: CookieProfile,
      ) {
            await this.guild.delete({
                  guild_id: guild_id,
                  owner_id: user.user_id,
            });
      }
      @Post('/join')
      @HttpCode(200)
      async join(
            @Body('guild_id') guild_id: string,
            @Profile() user: CookieProfile,
      ) {
            const requestError = new HttpException(
                  'Error! Cannot join to guild',
                  HttpStatus.BAD_REQUEST,
            );

            const guild = await this.guild.findGuild(guild_id);

            if (!guild) throw requestError;

            const createUsersGuilds = await this.userGuilds.joinToGuild({
                  guild_id,
                  permissions: DEFAULT_PERMISSION,
                  user_id: user.user_id,
            });

            if (!createUsersGuilds) throw requestError;

            const guildChannels = await this.guild.getGuildChannels(guild_id);
            const socket = this.socketStore.getUserSocket(user.user_id);
            const channelIds = guildChannels.map((v) => {
                  return String(v.id);
            });
            socket?.join(channelIds);
            return {
                  response: guild,
            };
      }
}
