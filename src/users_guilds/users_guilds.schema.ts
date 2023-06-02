import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { UsersGuildsType } from './users_guilds';

@Schema()
export class UsersGuilds extends Document implements UsersGuildsType {
  @Prop({
    type: String,
    required: true,
  })
  user_id: string;

  @Prop({
    type: [String],
    required: true,
  })
  chats: string[];
}

export const UsersGuildsSchema = SchemaFactory.createForClass(UsersGuilds);
