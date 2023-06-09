import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UsersChannelsType = {
  user_id: string;
  channel_id: string;
};
@Schema()
export class UsersChannels extends Document implements UsersChannelsType {
  @Prop({
    type: String,
    required: true,
  })
  user_id: string;

  @Prop({
    type: String,
    required: true,
  })
  channel_id: string;
}

export const UsersChannelsSchema = SchemaFactory.createForClass(UsersChannels);
