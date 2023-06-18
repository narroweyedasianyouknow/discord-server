import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChannelType, OverwriteType } from './channels';
import { UserType } from '@/controllers/person/person';
enum CHANNEL_TYPES_LIST {
  GUILD_TEXT = 0, // a text channel within a server
  DM = 1, // a direct message between users
  GUILD_VOICE = 2, // a voice channel within a server
  GROUP_DM = 3, // a direct message between multiple users
  GUILD_CATEGORY = 4, // an organizational category that contains up to 50 channels
  GUILD_ANNOUNCEMENT = 5, // a channel that users can follow and crosspost into their own server (formerly news channels)
  ANNOUNCEMENT_THREAD = 10, // a temporary sub-channel within a GUILD_ANNOUNCEMENT channel
  PUBLIC_THREAD = 11, // a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel
  PRIVATE_THREAD = 12, // a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
  GUILD_STAGE_VOICE = 13, // a voice channel for hosting events with an audience
  GUILD_DIRECTORY = 14, // the channel in a hub containing the listed servers
  GUILD_FORUM = 15, // Channel that can only contain threads
}
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
