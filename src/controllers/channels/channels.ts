import { UserType } from '@/controllers/person/person';

export type ChannelType = {
     /** The type of channel */
     channel_type: CHANNEL_TYPES_LIST;

     /** The id of the guild (may be missing for some channel objects received over gateway guild dispatches) */
     guild_id?: string;

     /** sorting position of the channel */
     position?: number;

     /** overwrite objects explicit permission overwrites for members and roles */
     permission_overwrites?: OverwriteType[];

     /** the name of the channel (1-100 characters) */
     name?: string;

     /** the channel topic (0-4096 characters for GUILD_FORUM channels, 0-1024 characters for all others) */
     topic?: string;

     /** whether the channel is nsfw */
     nsfw?: boolean;

     /** the id of the last message sent in this channel (or thread for GUILD_FORUM channels) (may not point to an existing or valid message or thread) */
     last_message_id?: string;

     /** the bitrate (in bits) of the voice channel */
     bitrate?: number;

     /** the user limit of the voice channel */
     user_limit?: number;

     /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected */
     rate_limit_per_user?: number;

     /** of user objects the recipients of the DM */
     recipients?: UserType[];

     /** icon hash of the group DM */
     icon?: string;

     /** id of the creator of the group DM or thread */
     owner_id?: string;

     /** for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created */
     parent_id?: string;

     /** timestamp when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned. */
     last_pin_timestamp?: number;

     /** voice region id for the voice channel, automatic when set to null */
     rtc_region?: string;

     /** the camera video quality mode of the voice channel, 1 when not present */
     video_quality_mode?: number;

     /** number of messages (not including the initial message or deleted messages) in a thread. */
     message_count?: number;

     /** number an approximate count of users in a thread, stops counting at 50 */
     member_count?: number;

     /** default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080 */
     default_auto_archive_duration?: number;

     /** computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction */
     permissions?: string;

     /** channel flags combined as a bitfield */
     flags?: number;

     /** number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted}; */
     total_message_sent?: number;
};
export enum CHANNEL_TYPES_LIST {
     /**  a text channel within a server */
     GUILD_TEXT = 0,

     /** a direct message between users */
     DM = 1,

     /** a voice channel within a server */
     GUILD_VOICE = 2,

     /** a direct message between multiple users */
     GROUP_DM = 3,

     /** an organizational category that contains up to 50 channels */
     GUILD_CATEGORY = 4,

     /** a channel that users can follow and crosspost into their own server (formerly news channels) */
     GUILD_ANNOUNCEMENT = 5,

     /** a temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
     ANNOUNCEMENT_THREAD = 10,

     /** a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel */
     PUBLIC_THREAD = 11,

     /** a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
     PRIVATE_THREAD = 12,

     /** a voice channel for hosting events with an audience */
     GUILD_STAGE_VOICE = 13,

     /** the channel in a hub containing the listed servers */
     GUILD_DIRECTORY = 14,

     /** Channel that can only contain threads */
     GUILD_FORUM = 15,
}
export type OverwriteType = {
     /** role or user id */
     id: string;

     /** either 0 (role) or 1 (member) */
     type: number;

     /** permission bit set */
     allow: string;

     /** permission bit set */
     deny: string;
};
