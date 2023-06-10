import { Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';

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
import { MONGOOSE_ERRORS } from '@/utils/errorCodes';
import { useMe } from '@/funcs/useMe';
import {
  DEFAULT_PERMISSION,
  UserGuildsService,
} from '@/users_guilds/users_guilds.service';

@Controller('guild')
export class GuildController {
  constructor(
    @Inject(UserGuildsService) private userGuilds: UserGuildsService,
    @Inject(GuildService) private guild: GuildService,
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
    @Req()
    request: Request<
      any,
      any,
      {
        name: string;
        avatar?: string;
      }
    >,
    @Res() response: Response,
  ) {
    const { name, avatar } = request.body;
    const user = useMe(request);
    const value: GuildType = {
      ...this.defaultValue,
      name: name,
      owner_id: user.user_id,
      icon: avatar,
    };

    this.guild
      .create(value)
      .then((res) => {
        const _id = res.id;
        this.userGuilds.create({
          user_id: user.user_id,
          guild_id: _id,
          permissions: DEFAULT_PERMISSION,
        });
        response.status(201).send({
          response: { ...value, id: _id },
        });
      })
      .catch(
        (err: {
          message: any;
          code: keyof typeof MONGOOSE_ERRORS;
          keyValue: Record<string, string>;
        }) => {
          const errCode = err.code;
          console.log(err?.message);
          if (errCode in MONGOOSE_ERRORS && MONGOOSE_ERRORS[errCode]) {
            response.status(401).send({
              response: MONGOOSE_ERRORS[errCode](err?.keyValue),
            });
          } else {
            response.status(401).send({
              response: err?.message,
            });
          }
        },
      );
  }
  @Get('/my')
  async get(
    @Req()
    request: Request,
    @Res() response: Response,
  ) {
    const user = useMe(request);
    this.userGuilds
      .findMyGuilds(user.user_id)
      .then((res) => {
        this.guild
          .findGuilds(res)
          .then((v) => {
            response.status(200).send({
              response: v,
            });
          })
          .catch(
            (err: {
              message: any;
              code: keyof typeof MONGOOSE_ERRORS;
              keyValue: Record<string, string>;
            }) => {
              const errCode = err.code;
              if (errCode in MONGOOSE_ERRORS && MONGOOSE_ERRORS[errCode]) {
                response.status(401).send({
                  response: MONGOOSE_ERRORS[errCode](err?.keyValue),
                });
              } else {
                response.status(401).send({
                  response: err?.message,
                });
              }
            },
          );
      })
      .catch((res) => {
        response.status(500).send({
          response: res,
        });
      });
  }
}
