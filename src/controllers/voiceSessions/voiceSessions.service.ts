import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { VoiceSession, VoiceSessionType } from './voiceSessions.schema';

@Injectable()
export class VoiceSessionService {
      constructor(
            @InjectModel(VoiceSession.name)
            private personModel: Model<VoiceSession>,
      ) {}

      async create(createPersonDto: VoiceSessionType) {
            const createdPerson = new this.personModel(createPersonDto);
            return createdPerson.save();
      }

      async find(channel_id: string): Promise<VoiceSessionType | null> {
            return this.personModel.findOne({ channel_id }).exec();
      }
}
