import {
      Controller,
      HttpCode,
      HttpException,
      HttpStatus,
      Inject,
      Param,
      Post,
} from '@nestjs/common';

import { VoiceSessionService } from './voiceSessions.service';

import { Profile } from '@/decorators/Profile';

@Controller('sessions')
export class VoiceSessionsController {
      constructor(
            @Inject(VoiceSessionService)
            private voiceSession: VoiceSessionService,
      ) {}

      @Post('/:channel_id')
      @HttpCode(200)
      async getChannel(
            @Param('channel_id') channel_id: string,
            @Profile() user: CookieProfile,
      ) {
            const session = await this.voiceSession.find(channel_id);
            if (!session) {
                  throw new HttpException(
                        'Error! Cannot get user',
                        HttpStatus.BAD_REQUEST,
                  );
            }

            return session;
      }
}
