import { Controller, Get, Inject, Res } from '@nestjs/common';
import type { Response } from 'express';

import { UserGuildsService } from './users_guilds.service';

import { Profile } from '@/decorators/Profile';

@Controller('users_guilds')
export default class UsersGuildsController {
     constructor(
          @Inject(UserGuildsService) private userGuilds: UserGuildsService,
     ) {}
     expiresAge = () => {
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          return date;
     };

     @Get()
     async create(@Res() response: Response, @Profile() user: CookieProfile) {
          this.userGuilds
               .findMyGuilds(user.user_id)
               .then((guilds) => {
                    response.status(200).send({
                         response: guilds,
                    });
               })
               .catch((err) => {
                    response.status(401).send({
                         response: err?.message,
                    });
               });
     }
}
