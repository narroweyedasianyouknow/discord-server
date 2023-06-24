import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RolesType = {
     name: string; // role name
     color: number; // integer representation of hexadecimal color code
     hoist: boolean; // if this role is pinned in the user listing
     icon?: string; // role icon hash
     unicode_emoji?: string; // role unicode emoji
     position: number; // position of this role
     permissions: string; // permission bit set
     managed: boolean; // whether this role is managed by an integration
     mentionable: boolean; // whether this role is mentionable
     tags?: RoleTagType; // role tags object the tags this role has
};

export enum PERMISSIONS_LIST {
     /**
      * @description Allows creation of instant invites T, V, S
      */
     CREATE_INSTANT_INVITE = 0x0000000000000001,

     /**
      * @description Allows kicking members
      */
     KICK_MEMBERS = 0x0000000000000002,

     /**
      * @description Allows banning members  =
      */
     BAN_MEMBERS = 0x0000000000000004,

     /**
      * @description Allows all permissions and bypasses channel permission overwrites  =
      */
     ADMINISTRATOR = 0x0000000000000008,

     /**
      * @description Allows management and editing of channels T, V, S
      */
     MANAGE_CHANNELS = 0x0000000000000010,

     /**
      * @description Allows management and editing of the guild  =
      */
     MANAGE_GUILD = 0x0000000000000020,

     /**
      * @description Allows for the addition of reactions to messages T, V, S
      */
     ADD_REACTIONS = 0x0000000000000040,

     /**
      * @description Allows for viewing of audit logs
      */
     VIEW_AUDIT_LOG = 0x0000000000000080,

     /**
      * @description Allows for using priority speaker in a voice channel V
      */
     PRIORITY_SPEAKER = 0x0000000000000100,

     /**
      * @description Allows the user to go live V, S
      */
     STREAM = 0x0000000000000200,

     /**
      * @description  Allows guild members to view a channel,
      * which includes reading messages in text channels and joining voice channels T, V, S
      */
     VIEW_CHANNEL = 0x0000000000000400,

     /**
      * @description Allows for sending messages in a channel
      * and creating threads in a forum (does not allow sending messages in threads) T, V, S
      */
     SEND_MESSAGES = 0x0000000000000800,

     /**
      * @description Allows for sending of /tts messages T, V, S
      */
     SEND_TTS_MESSAGES = 0x0000000000001000,

     /**
      * @description Allows for deletion of other users messages T, V, S
      */
     MANAGE_MESSAGES = 0x0000000000002000,

     /**
      * @description Links sent by users with this permission will be auto-embedded T, V, S
      */
     EMBED_LINKS = 0x0000000000004000,

     /**
      * @description Allows for uploading images and files T, V, S
      */
     ATTACH_FILES = 0x0000000000008000,

     /**
      * @description Allows for reading of message history T, V, S
      */
     READ_MESSAGE_HISTORY = 0x0000000000010000,

     /**
      * @description Allows for using the `@everyone` tag to notify all users in a channel,
      * and the `@here` tag to notify all online users in a channel T, V, S
      */
     MENTION_EVERYONE = 0x0000000000020000,

     /**
      * @description Allows the usage of custom emojis from other servers T, V, S
      */
     USE_EXTERNAL_EMOJIS = 0x0000000000040000,

     /**
   * @description Allows for viewing guild insights  =

   */
     VIEW_GUILD_INSIGHTS = 0x0000000000080000,

     /**
   * @description Allows for joining of a voice channel V, S

   */
     CONNECT = 0x0000000000100000,

     /**
      * @description Allows for speaking in a voice channel V
      */
     SPEAK = 0x0000000000200000,

     /**
      * @description Allows for muting members in a voice channel V, S
      */
     MUTE_MEMBERS = 0x0000000000400000,

     /**
      * @description Allows for deafening of members in a voice channel V
      */
     DEAFEN_MEMBERS = 0x0000000000800000,

     /**
      * @description Allows for moving of members between voice channels V, S
      */
     MOVE_MEMBERS = 0x0000000001000000,

     /**
      * @description Allows for using voice-activity-detection in a voice channel V
      */
     USE_VAD = 0x0000000002000000,

     /**
      * @description Allows for modification of own nickname  =
      */
     CHANGE_NICKNAME = 0x0000000004000000,

     /**
      * @description Allows for modification of other users nicknames  =
      */
     MANAGE_NICKNAMES = 0x0000000008000000,

     /**
      * @description Allows management and editing of roles T, V, S
      */
     MANAGE_ROLES = 0x0000000010000000,
     /**
      * @description Allows management and editing of webhooks T, V, S
      */
     MANAGE_WEBHOOKS = 0x0000000020000000,

     /**
      * @description Allows management and editing of emojis, stickers, and soundboard sounds  =
      */
     MANAGE_GUILD_EXPRESSIONS = 0x0000000040000000,

     /**
      * @description Allows members to use application commands, including slash commands and context menu commands. T, V, S
      */
     USE_APPLICATION_COMMANDS = 0x0000000080000000,

     /**
      * @description Allows for requesting to speak in stage channels.
      * (This permission is under active development and may be changed or removed.) S
      */
     REQUEST_TO_SPEAK = 0x0000000100000000,

     /**
      * @description Allows for creating, editing, and deleting scheduled events V, S
      */
     MANAGE_EVENTS = 0x0000000200000000,

     /**
      * @description Allows for deleting and archiving threads, and viewing all private threads T
      */
     MANAGE_THREADS = 0x0000000400000000,

     /**
      * @description Allows for creating public and announcement threads T
      */
     CREATE_PUBLIC_THREADS = 0x0000000800000000,

     /**
      * @description Allows for creating private threads T
      */
     CREATE_PRIVATE_THREADS = 0x0000001000000000,

     /**
      * @description Allows the usage of custom stickers from other servers T, V, S
      */
     USE_EXTERNAL_STICKERS = 0x0000002000000000,

     /**
      * @description Allows for sending messages in threads T
      */
     SEND_MESSAGES_IN_THREADS = 0x0000004000000000,

     /**
      * @description Allows for using Activities (applications with the EMBEDDED flag) in a voice channel V
      */
     USE_EMBEDDED_ACTIVITIES = 0x0000008000000000,

     /**
      * @description Allows for timing out users to prevent them from sending
      * or reacting to messages in chat and threads, and from speaking in voice and stage channels  =
      */
     MODERATE_MEMBERS = 0x0000010000000000,

     /**
      * @description  Allows for members to share their video, screen share, or stream game in server
      */
     VIDEO = 0x0000020000000000,

     /**
      * @description Allows for using soundboard in a voice channel V
      */
     USE_SOUNDBOARD = 0x0000040000000000,

     /**
      * @description Allows the usage of custom soundboard sounds from other servers V
      */
     USE_EXTERNAL_SOUNDS = 0x0000200000000000,

     /**
      * @description Allows sending voice messages T, V, S
      */
     SEND_VOICE_MESSAGES = 0x0000400000000000,
}

export type RoleTagType = {
     bot_id?: string; // the id of the bot this role belongs to
     integration_id?: string; // the id of the integration this role belongs to
     premium_subscriber?: boolean | null; // whether this is the guild's Booster role
     subscription_listing_id?: string; // the id of this role's subscription sku and listing
     available_for_purchase?: boolean | null; // whether this role is available for purchase
     guild_connections?: any | null; // whether this role is a guild's linked role
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
          type: String,
     })
     permissions: string;

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
