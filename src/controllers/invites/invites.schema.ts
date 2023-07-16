import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ChannelType } from '../channels/channels';
import { GuildType } from '../guild/guild.schema';
import { PersonType } from '../person/person';

export type InviteType = {
      /** the invite code (unique ID) */
      code: string;

      /** the guild this invite is for */
      guild?: Partial<GuildType>;

      /** partial channel object the channel this invite is for */
      channel?: Partial<ChannelType>;

      /** user object	the user who created the invite */
      inviter?: Partial<PersonType>;

      /** the type of target for this voice channel invite */
      target_type?: number;

      /** approximate count of online members, returned from the GET /invites/<code> endpoint when with_counts is true */
      approximate_presence_count?: number;

      /** approximate count of total members, returned from the GET /invites/<code> endpoint when with_counts is true */
      approximate_member_count?: number;

      /**
       * the expiration date of this invite, returned from the GET /invites/<code> endpoint when with_expiration is true
       * example: 2023-07-21T11:02:12+00:00
       */
      expires_at?: string;
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
export class Invites extends Document implements InviteType {
      @Prop({
            type: String,
            unique: true,
      })
      code: string;

      @Prop({
            type: Number,
      })
      used_count: number;

      @Prop({
            type: Number,
      })
      max_used_count: number;

      @Prop({
            type: Object,
      })
      guild?: Partial<GuildType & { id: string }>;

      @Prop({
            type: Object,
      })
      channel?: Partial<ChannelType>;

      @Prop({
            type: Object,
      })
      inviter?: Partial<PersonType>;

      @Prop({
            type: Number,
      })
      target_type?: number;

      @Prop({
            type: Number,
      })
      approximate_presence_count?: number;

      @Prop({
            type: Number,
      })
      approximate_member_count?: number;

      @Prop({
            type: String,
      })
      expires_at: string;
}

export const InvitesSchema = SchemaFactory.createForClass(Invites);
