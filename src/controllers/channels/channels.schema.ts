import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
export class Channels extends Document {
      @Prop({
            type: Number,
      })
      channel_type: number;

      @Prop({
            type: String,
      })
      guild_id?: string;

      @Prop({
            type: Number,
      })
      position?: number;
      // permission_overwrites?: OverwriteType[];

      @Prop({
            type: String,
      })
      name?: string;

      @Prop({
            type: String,
      })
      topic?: string;

      @Prop({
            type: Boolean,
      })
      nsfw?: boolean;

      @Prop({
            type: String,
      })
      last_message_id?: string;

      @Prop({
            type: Number,
      })
      bitrate?: number;

      @Prop({
            type: Number,
      })
      user_limit?: number;

      @Prop({
            type: Number,
      })
      rate_limit_per_user?: number;

      // recipients?: UserType[];
      @Prop({
            type: String,
      })
      icon?: string;

      @Prop({
            type: String,
      })
      owner_id?: string;

      @Prop({
            type: String,
      })
      parent_id?: string;

      @Prop({
            type: Number,
      })
      last_pin_timestamp?: number;

      @Prop({
            type: String,
      })
      rtc_region?: string;

      @Prop({
            type: Number,
      })
      video_quality_mode?: number;

      @Prop({
            type: Number,
      })
      message_count?: number;

      @Prop({
            type: Number,
      })
      member_count?: number;

      @Prop({
            type: Number,
      })
      default_auto_archive_duration?: number;

      @Prop({
            type: String,
      })
      permissions?: string;

      @Prop({
            type: Number,
      })
      flags?: number;

      @Prop({
            type: Number,
      })
      total_message_sent?: number;
}

export const ChannelsSchema = SchemaFactory.createForClass(Channels);
