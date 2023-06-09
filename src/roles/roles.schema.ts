import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RolesType = {
  name: string; //	role name
  color: number; //	integer representation of hexadecimal color code
  hoist: boolean; //	if this role is pinned in the user listing
  icon?: string; //	role icon hash
  unicode_emoji?: string; //	role unicode emoji
  position: number; //	position of this role
  permissions: Permissions; //	permission bit set
  managed: boolean; //	whether this role is managed by an integration
  mentionable: boolean; //	whether this role is mentionable
  tags?: RoleTagType; //	role tags object	the tags this role has
};

export enum Permissions {
  /**
   * @description Allows creation of instant invites	T, V, S
   */
  CREATE_INSTANT_INVITE = 1 << 0,

  /**
   * @description Allows kicking members
   */
  KICK_MEMBERS = 1 << 1,

  /**
   * @description Allows banning members	 =
   */
  BAN_MEMBERS = 1 << 2,

  /**
   * @description Allows all permissions and bypasses channel permission overwrites	 =
   */
  ADMINISTRATOR = 1 << 3,

  /**
   * @description Allows management and editing of channels	T, V, S
   */
  MANAGE_CHANNELS = 1 << 4,

  /**
   * @description Allows management and editing of the guild	 =
   */
  MANAGE_GUILD = 1 << 5,

  /**
   * @description Allows for the addition of reactions to messages	T, V, S
   */
  ADD_REACTIONS = 1 << 6,

  /**
   * @description Allows for viewing of audit logs
   */
  VIEW_AUDIT_LOG = 1 << 7,

  /**
   * @description Allows for using priority speaker in a voice channel	V
   */
  PRIORITY_SPEAKER = 1 << 8,

  /**
   * @description Allows the user to go live	V, S
   */
  STREAM = 1 << 9,

  /**
   * @description 	Allows guild members to view a channel,
   * which includes reading messages in text channels and joining voice channels	T, V, S
   */
  VIEW_CHANNEL = 1 << 10,

  /**
   * @description Allows for sending messages in a channel
   * and creating threads in a forum (does not allow sending messages in threads)	T, V, S
   */
  SEND_MESSAGES = 1 << 11,

  /**
   * @description Allows for sending of /tts messages	T, V, S
   */
  SEND_TTS_MESSAGES = 1 << 12,

  /**
   * @description Allows for deletion of other users messages	T, V, S
   */
  MANAGE_MESSAGES = 1 << 13,

  /**
   * @description Links sent by users with this permission will be auto-embedded	T, V, S
   */
  EMBED_LINKS = 1 << 14,

  /**
   * @description Allows for uploading images and files	T, V, S
   */
  ATTACH_FILES = 1 << 15,

  /**
   * @description Allows for reading of message history	T, V, S
   */
  READ_MESSAGE_HISTORY = 1 << 16,

  /**
   * @description Allows for using the `@everyone` tag to notify all users in a channel,
   * and the `@here` tag to notify all online users in a channel	T, V, S
   */
  MENTION_EVERYONE = 1 << 17,

  /**
   * @description Allows the usage of custom emojis from other servers	T, V, S
   */
  USE_EXTERNAL_EMOJIS = 1 << 18,

  /**
   * @description Allows for viewing guild insights	 =

   */
  VIEW_GUILD_INSIGHTS = 1 << 19,

  /**
   * @description Allows for joining of a voice channel	V, S

   */
  CONNECT = 1 << 20,

  /**
   * @description Allows for speaking in a voice channel	V
   */
  SPEAK = 1 << 21,

  /**
   * @description Allows for muting members in a voice channel	V, S
   */
  MUTE_MEMBERS = 1 << 22,

  /**
   * @description Allows for deafening of members in a voice channel	V
   */
  DEAFEN_MEMBERS = 1 << 23,

  /**
   * @description Allows for moving of members between voice channels	V, S
   */
  MOVE_MEMBERS = 1 << 24,

  /**
   * @description Allows for using voice-activity-detection in a voice channel	V
   */
  USE_VAD = 1 << 25,

  /**
   * @description Allows for modification of own nickname	 =
   */
  CHANGE_NICKNAME = 1 << 26,

  /**
   * @description Allows for modification of other users nicknames	 =
   */
  MANAGE_NICKNAMES = 1 << 27,

  /**
   * @description Allows management and editing of roles	T, V, S
   */
  MANAGE_ROLES = 1 << 28,
  /**
   * @description Allows management and editing of webhooks	T, V, S
   */
  MANAGE_WEBHOOKS = 1 << 29,

  /**
   * @description Allows management and editing of emojis, stickers, and soundboard sounds	 =
   */
  MANAGE_GUILD_EXPRESSIONS = 1 << 30,

  /**
   * @description Allows members to use application commands, including slash commands and context menu commands.	T, V, S
   */
  USE_APPLICATION_COMMANDS = 1 << 31,

  /**
   * @description Allows for requesting to speak in stage channels.
   * (This permission is under active development and may be changed or removed.)	S
   */
  REQUEST_TO_SPEAK = 1 << 32,

  /**
   * @description Allows for creating, editing, and deleting scheduled events	V, S
   */
  MANAGE_EVENTS = 1 << 33,

  /**
   * @description Allows for deleting and archiving threads, and viewing all private threads	T
   */
  MANAGE_THREADS = 1 << 34,

  /**
   * @description Allows for creating public and announcement threads	T
   */
  CREATE_PUBLIC_THREADS = 1 << 35,

  /**
   * @description Allows for creating private threads	T
   */
  CREATE_PRIVATE_THREADS = 1 << 36,

  /**
   * @description Allows the usage of custom stickers from other servers	T, V, S
   */
  USE_EXTERNAL_STICKERS = 1 << 37,

  /**
   * @description Allows for sending messages in threads	T
   */
  SEND_MESSAGES_IN_THREADS = 1 << 38,

  /**
   * @description Allows for using Activities (applications with the EMBEDDED flag) in a voice channel	V
   */
  USE_EMBEDDED_ACTIVITIES = 1 << 39,

  /**
   * @description Allows for timing out users to prevent them from sending
   * or reacting to messages in chat and threads, and from speaking in voice and stage channels	 =
   */
  MODERATE_MEMBERS = 1 << 40,

  /**
   * @description 	Allows for viewing role subscription insights	 =
   */
  VIEW_CREATOR_MONETIZATION_ANALYTICS = 1 << 41,

  /**
   * @description Allows for using soundboard in a voice channel	V
   */
  USE_SOUNDBOARD = 1 << 42,

  /**
   * @description Allows the usage of custom soundboard sounds from other servers	V
   */
  USE_EXTERNAL_SOUNDS = 1 << 43,

  /**
   * @description Allows sending voice messages	T, V, S
   */
  SEND_VOICE_MESSAGES = 1 << 44,
}

export type RoleTagType = {
  bot_id?: string; //	the id of the bot this role belongs to
  integration_id?: string; //	the id of the integration this role belongs to
  premium_subscriber?: boolean | null; //	whether this is the guild's Booster role
  subscription_listing_id?: string; //	the id of this role's subscription sku and listing
  available_for_purchase?: boolean | null; //	whether this role is available for purchase
  guild_connections?: any | null; //	whether this role is a guild's linked role
};
@Schema()
export class Roles extends Document implements RolesType {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: Number,
  })
  color: number;

  @Prop({
    type: Boolean,
  })
  hoist: boolean;

  @Prop({
    type: String,
  })
  icon?: string | undefined;

  @Prop({
    type: String,
  })
  unicode_emoji?: string | undefined;

  @Prop({
    type: Number,
  })
  position: number;

  @Prop({
    type: Number,
  })
  permissions: Permissions;

  @Prop({
    type: Boolean,
  })
  managed: boolean;

  @Prop({
    type: Boolean,
  })
  mentionable: boolean;

  @Prop({
    type: {
      bot_id: String,
      integration_id: String,
      premium_subscriber: Boolean,
      subscription_listing_id: String,
      available_for_purchase: Boolean,
      guild_connections: Object,
    },
  })
  tags?: RoleTagType;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
