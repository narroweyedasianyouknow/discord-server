import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { PersonType, UserType } from 'src/person/person';
export type MessagesType = {
  channel_id: string; // id of the channel the message was sent in
  author: Partial<UserType>; // user object the author of this message (not guaranteed to be a valid user, see below)
  content: string; // string contents of the message
  timestamp: number; // timestamp when this message was sent
  edited_timestamp?: number; // timestamp when this message was edited (or null if never)
  tts: boolean; // whether this was a TTS message
  mention_everyone: boolean; // whether this message mentions everyone
  mentions: any[]; // of user objects users specifically mentioned in the message
  mention_roles: any[]; // of role object ids roles specifically mentioned in this message
  mention_channels?: any[]; // array of channel mention objects channels specifically mentioned in this message
  attachments: any[]; // array of attachment objects any attached files
  //  embeds: any[]; // array of embed objects any embedded content
  //  reactions?: any[]; // array of reaction objects reactions to the message
  nonce?: number | string; // integer or string used for validating a message was sent
  pinned: boolean; // whether this message is pinned
  //  webhook_id?: string; // // snowflake if the message is generated by a webhook, this is the webhook's id
  type: number; // type of message
  //  activity?: any; // message activity object sent with Rich Presence-related chat embeds
  //  application?: any; // partial application object sent with Rich Presence-related chat embeds
  //  application_id?: string; // snowflake if the message is an Interaction or application-owned webhook, this is the id of the application
  message_reference?: string; // message reference object data showing the source of a crosspost, channel follow add, pin, or reply message
  flags?: number; // integer message flags combined as a bitfield
  referenced_message?: Partial<MessagesType>; // ?message object the message associated with the message_reference
  //  interaction?: any; // message interaction object sent if the message is a response to an Interaction
  //  thread?: any; // channel object the thread that was started from this message, includes thread member object
  // components?: any[]; // array of message components sent if the message contains components like buttons, action rows, or other interactive components
  //  sticker_items?: MessageStickerItemType[]; // array of message sticker item objects sent if the message contains stickers
  position?: number; // integer A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread
  //  role_subscription_data?: RoleSubscriptionDataType; // role subscription data object data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message
};

type MessageStickerItemType = {
  id: string; // id of the sticker
  name: string; // name of the sticker
  format_type: STICKER_FORMAT_TYPES; // type of sticker format
};
enum STICKER_FORMAT_TYPES {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
  GIF = 4,
}
type RoleSubscriptionDataType = {
  role_subscription_listing_id: string; // the id of the sku and listing that the user is subscribed to
  tier_name: string; // the name of the tier that the user is subscribed to
  total_months_subscribed: number; // the cumulative number of months that the user has been subscribed for
  is_renewal: boolean; // whether this notification is for a renewal rather than a new purchase
};

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Messages extends Document implements MessagesType {
  @Prop({ type: [Object] })
  mentions: any[];

  @Prop({ type: [Object] })
  mention_roles: any[];

  @Prop({ type: [Object] })
  mention_channels?: any[] | undefined;

  @Prop({ type: [Object] })
  attachments: any[];

  @Prop(String)
  channel_id: string;

  @Prop({
    type: Object,
  })
  author: Partial<UserType>;

  @Prop({
    type: String,
  })
  content: string;

  @Prop({
    type: Number,
  })
  timestamp: number;

  @Prop({
    type: Number,
  })
  edited_timestamp?: number | undefined;

  @Prop({
    type: Boolean,
  })
  tts: boolean;

  @Prop({
    type: Boolean,
  })
  mention_everyone: boolean;

  @Prop({
    type: String,
  })
  nonce?: string | undefined;

  @Prop({
    type: Boolean,
  })
  pinned: boolean;

  @Prop({
    type: Number,
  })
  type: number;

  @Prop({
    type: String,
  })
  message_reference?: string | undefined;

  @Prop({
    type: Number,
  })
  flags?: number | undefined;

  @Prop({
    type: Object,
  })
  referenced_message?: Partial<MessagesType>;

  @Prop({
    type: Number,
  })
  position?: number | undefined;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
