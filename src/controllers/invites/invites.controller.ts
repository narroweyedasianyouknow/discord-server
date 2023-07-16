import {
      Controller,
      Body,
      Post,
      Inject,
      Param,
      HttpCode,
} from '@nestjs/common';

import { InvitesService } from './invites.service';

import { Profile } from '@/decorators/Profile';

@Controller('invites')
export class InvitesController {
      constructor(
            @Inject(InvitesService)
            private readonly inviteService: InvitesService,
      ) {}

      @Post('use/:code')
      @HttpCode(200)
      async useInvite(
            @Profile() { user_id }: CookieProfile,
            @Param('code') code: string,
      ) {
            const res = await this.inviteService.useInvite({
                  code: code,
                  user_id: user_id,
            });

            return res;
      }

      @Post('/create')
      @HttpCode(201)
      async createInvite(
            @Body('guild_id') guild_id: string,
            @Profile() profile: CookieProfile,
      ) {
            const res = await this.inviteService.create({
                  guild_id: guild_id,
                  user_id: profile.user_id,
            });
            return res;
      }
}
