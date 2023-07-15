import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VoiceSessionsController } from './voiceSessions.controller';
import { VoiceSession, VoiceSessionSchema } from './voiceSessions.schema';
import { VoiceSessionService } from './voiceSessions.service';

@Module({
      imports: [
            MongooseModule.forFeature([
                  { name: VoiceSession.name, schema: VoiceSessionSchema },
            ]),
      ],
      controllers: [VoiceSessionsController],
      providers: [VoiceSessionService],
})
export class VoiceSessionsModule {}
