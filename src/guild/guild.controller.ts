import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';

import {
  DEFAULT_MESSAGE_NOTIFICATIONS_LEVEL,
  EXPLICIT_CONTENT_LEVEL,
  MFA_LEVEL,
  NSFW_LEVEL,
  SYSTEM_CHANNEL_FLAGS,
  VERIFICATION_LEVEL,
} from './guild.schema';
import { GuildService } from './guild.service';
import type { GuildType } from './guild.schema';
import type { Request, Response } from 'express';
import {
  DEFAULT_PERMISSION,
  UserGuildsService,
} from '@/users_guilds/users_guilds.service';
import { SocketStore } from '@/SocketStore';
import { SocketIoServer } from '@/socket-io.server';
import { Profile } from '@/decorators/Profile';

@Controller('guild')
export class GuildController {
  constructor(
    @Inject(UserGuildsService) private userGuilds: UserGuildsService,
    @Inject(GuildService) private guild: GuildService,
    @Inject(SocketStore) private socketStore: SocketStore,
    @Inject(SocketIoServer) private socketServer: SocketIoServer,
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
    system_channel_flags: SYSTEM_CHANNEL_FLAGS.SUPPRESS_JOIN_NOTIFICATIONS,
    rules_channel_id: '',
    premium_tier: 0,
    preferred_locale: '',
    nsfw_level: NSFW_LEVEL.DEFAULT,
    premium_progress_bar_enabled: false,
  };

  @Get('')
  async getGuild(@Res() response: Response) {
    response.status(200).send({
      response: true,
    });
  }

  @Post('/create')
  async create(
    @Body()
    body: {
      name: string;
      avatar?: string;
    },
    @Res() response: Response,
    @Profile() user: CookieProfile,
  ) {
    const { name, avatar } = body;
    const value: GuildType = {
      ...this.defaultValue,
      name: name,
      owner_id: user.user_id,
      icon: avatar,
    };

    this.guild
      .create(value)
      .then((res) => {
        this.userGuilds.create({
          user_id: user.user_id,
          guild_id: res.id,
          permissions: DEFAULT_PERMISSION,
        });

        const socket = this.socketStore.getUserSocket(user.user_id);
        const channelIds = res.channels.map((v) => {
          return String(v.id);
        });
        socket?.join(channelIds);
        response.status(201).send({
          response: res,
        });
      })
      .catch((err) => {
        const errCode = err.code;
        console.log(err?.message);
        response.status(401).send({
          response: err?.message,
        });
      });
  }
  @Get('/my')
  async get(@Res() response: Response, @Profile() user: CookieProfile) {
    this.userGuilds
      .findMyGuilds(user.user_id)
      .then((res) => {
        this.guild
          .findGuildsList(res)
          .then((v) => {
            response.status(200).send({
              response: v,
            });
          })
          .catch((err) => {
            response.status(401).send({
              response: err?.message,
            });
          });
      })
      .catch((res) => {
        response.status(500).send({
          response: res,
        });
      });
  }

  @Post('/join')
  async join(
    @Body()
    body: {
      guild_id: string;
    },
    @Res() response: Response,
    @Profile() user: CookieProfile,
  ) {
    const { guild_id } = body;

    this.guild
      .findGuild(guild_id)
      .then((guild) => {
        this.userGuilds
          .joinToGuild({
            guild_id,
            permissions: DEFAULT_PERMISSION,
            user_id: user.user_id,
          })
          .then(() => {
            this.guild
              .getGuildChannels(guild_id)
              .then(async (channels) => {
                const socket = this.socketStore.getUserSocket(user.user_id);
                const channelIds = channels.map((v) => {
                  return String(v.id);
                });
                socket?.join(channelIds);
                response.status(200).send({
                  response: guild,
                });
              })
              .catch((err) => {
                response.status(401).send({
                  response: err?.message,
                });
              });
          })
          .catch((err) => {
            response.status(401).send({
              response: err?.message,
            });
          });
      })
      .catch((err) => {
        response.status(401).send({
          response: err?.message,
        });
      });
  }
}
