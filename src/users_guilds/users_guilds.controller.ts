import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { UserGuildsService } from './users_guilds.service';
import type { Request, Response } from 'express';
import { MONGOOSE_ERRORS } from 'src/errorCodes';

import { useMe } from 'src/funcs/useMe';
import { GuildService } from 'src/guild/guild.service';
// import { UserGuildsService } from './users_guilds.service';

@Controller('users_guilds')
export default class UsersGuildsController {
  constructor(
    @Inject(UserGuildsService) private userGuilds: UserGuildsService,
    @Inject(GuildService) private guild: GuildService,
  ) {}
  expiresAge = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  @Get()
  async create(@Req() request: Request, @Res() response: Response) {
    const user = useMe(request);

    this.userGuilds
      .findMyGuilds(user.user_id)
      .then((guilds) => {
        response.status(200).send({
          response: guilds,
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
            console.log(err?.code);
            response.status(401).send({
              response: err?.message,
            });
          }
        },
      );
  }
}
