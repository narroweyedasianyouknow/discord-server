import { UserType } from '@/person/person';

export type ChannelType = {
  channel_type: CHANNEL_TYPES_LIST; //	the type of channel
  guild_id?: string; //	string	the id of the guild (may be missing for some channel objects received over gateway guild dispatches)
  position?: number; //	sorting position of the channel
  permission_overwrites?: OverwriteType[]; // of overwrite objects	explicit permission overwrites for members and roles
  name?: string; //	the name of the channel (1-100 characters)
  topic?: string; // string	the channel topic (0-4096 characters for GUILD_FORUM channels, 0-1024 characters for all others)
  nsfw?: boolean; // whether the channel is nsfw
  last_message_id?: string; // the id of the last message sent in this channel (or thread for GUILD_FORUM channels) (may not point to an existing or valid message or thread)
  bitrate?: number; //	the bitrate (in bits) of the voice channel
  user_limit?: number; //	the user limit of the voice channel
  rate_limit_per_user?: number; //		amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected
  recipients?: UserType[]; // of user objects	the recipients of the DM
  icon?: string; //	icon hash of the group DM
  owner_id?: string; //		id of the creator of the group DM or thread
  parent_id?: string; //		for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created
  last_pin_timestamp?: number; //	?ISO8601 timestamp	when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned.
  rtc_region?: string; //	voice region id for the voice channel, automatic when set to null
  video_quality_mode?: number; //	the camera video quality mode of the voice channel, 1 when not present
  message_count?: number; //	number of messages (not including the initial message or deleted messages) in a thread.
  member_count?: number; //	number	an approximate count of users in a thread, stops counting at 50
  default_auto_archive_duration?: number; //	number	default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080
  permissions?: string; //		computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction
  flags?: number; //		channel flags combined as a bitfield
  total_message_sent?: number; //		number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted};
};
export enum CHANNEL_TYPES_LIST {
  GUILD_TEXT = 0, //	a text channel within a server
  DM = 1, //	a direct message between users
  GUILD_VOICE = 2, //	a voice channel within a server
  GROUP_DM = 3, //	a direct message between multiple users
  GUILD_CATEGORY = 4, //	an organizational category that contains up to 50 channels
  GUILD_ANNOUNCEMENT = 5, //	a channel that users can follow and crosspost into their own server (formerly news channels)
  ANNOUNCEMENT_THREAD = 10, //	a temporary sub-channel within a GUILD_ANNOUNCEMENT channel
  PUBLIC_THREAD = 11, //	a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel
  PRIVATE_THREAD = 12, //	a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
  GUILD_STAGE_VOICE = 13, //	a voice channel for hosting events with an audience
  GUILD_DIRECTORY = 14, //	the channel in a hub containing the listed servers
  GUILD_FORUM = 15, //	Channel that can only contain threads
}
export type OverwriteType = {
  id: string; //	role or user id
  type: number; //	either 0 (role) or 1 (member)
  allow: string; //	permission bit set
  deny: string; //	permission bit set
};
