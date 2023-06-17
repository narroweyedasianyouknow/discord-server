import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { PersonType } from 'src/person/person';
export type InviteType = {
  code: string;
  guild_id: string;
  expires: number;
  used_count: number;
  max_used_count: number;
};
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
export class Invite extends Document implements InviteType {
  @Prop({
    type: String,
    unique: true,
  })
  code: string;

  @Prop({
    type: String,
  })
  guild_id: string;

  @Prop({
    type: Number,
  })
  expires: number;

  @Prop({
    type: Number,
  })
  used_count: number;

  @Prop({
    type: Number,
  })
  max_used_count: number;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
