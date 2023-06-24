import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import { InvitesService } from './invites.service';

import { Cookies } from '@/decorators/Cookies';

@Controller('invites')
export class InvitesController {
     constructor(
          @Inject(InvitesService)
          private readonly inviteService: InvitesService,
     ) {}

     @Get('use/:code')
     async useInvite(
          @Query('user_id') user_id: string,
          @Query('guild_id') guild_id: string,
          @Param('code') code: string,
          @Res() response: Response,
     ) {
          const res = await this.inviteService.useInvite({
               code: code,
               guild_id: guild_id,
               user_id: user_id,
          });
          response.status(201).send({
               response: res,
          });
     }

     @Get('/create')
     async createInvite(
          @Query('guild_id') guild_id: string,
          @Query('code') code: string,
          @Cookies('token') token: CookieValue,
          @Res() response: Response,
     ): Promise<void> {
          // const res = await this.inviteService.useInvite({
          //   code: code,
          //   guild_id: guild_id,
          //   user_id: user_id,
          // });
          response.status(201).send({
               response: token,
          });
     }
}
