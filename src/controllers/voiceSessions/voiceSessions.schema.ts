import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoiceSessionType = {
      channel_id: string;
} & RTCSessionDescriptionInit;
@Schema({
      toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                  ret.id = ret._id;
                  delete ret._id;
                  delete ret.__v;
            },
      },
})
export class VoiceSession extends Document implements VoiceSessionType {
      @Prop({
            type: String,
      })
      type: RTCSdpType;

      @Prop({
            type: String,
      })
      channel_id: string;

      @Prop({
            type: String,
      })
      sdp?: string;
}

export const VoiceSessionSchema = SchemaFactory.createForClass(VoiceSession);
