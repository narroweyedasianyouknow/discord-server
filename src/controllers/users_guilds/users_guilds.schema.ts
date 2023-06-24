import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import type { UsersGuildsType } from './users_guilds';
import { DEFAULT_PERMISSION } from './users_guilds.service';

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
export class UsersGuilds extends Document implements UsersGuildsType {
     @Prop({
          type: String,
          required: true,
     })
     user_id: string;

     @Prop({
          type: String,
          required: true,
     })
     guild_id: string;

     @Prop({
          type: String,
          default: DEFAULT_PERMISSION,
     })
     permissions: string;
}

export const UsersGuildsSchema = SchemaFactory.createForClass(UsersGuilds);
