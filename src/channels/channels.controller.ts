import { useMe } from '@/funcs/useMe';
// import { UserGuildsService } from '@/users_guilds/users_guilds.service';
import {
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ChannelType } from './channels';
import { CHANNEL_TYPES_LIST } from './channels';
import { ChannelService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(@Inject(ChannelService) private channel: ChannelService) {}
  // @Inject(UserGuildsService) private userGuilds: UserGuildsService,

  private defaultValue: ChannelType = {
    channel_type: CHANNEL_TYPES_LIST.GUILD_TEXT,
    permission_overwrites: [], // of overwrite objects explicit permission overwrites for members and roles
    nsfw: false, // whether the channel is nsfw
    recipients: [], // of user objects the recipients of the DM
    guild_id: undefined, // string the id of the guild (may be missing for some channel objects received over gateway guild dispatches)
    position: undefined, // sorting position of the channel
    name: undefined, // the name of the channel (1-100 characters)
    topic: undefined, // string the channel topic (0-4096 characters for GUILD_FORUM channels, 0-1024 characters for all others)
    last_message_id: undefined, // the id of the last message sent in this channel (or thread for GUILD_FORUM channels) (may not point to an existing or valid message or thread)
    bitrate: undefined, // the bitrate (in bits) of the voice channel
    user_limit: undefined, // the user limit of the voice channel
    rate_limit_per_user: undefined, //  amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected
    icon: undefined, // icon hash of the group DM
    owner_id: undefined, //  id of the creator of the group DM or thread
    parent_id: undefined, //  for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created
    last_pin_timestamp: undefined, // ?ISO8601 timestamp when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned.
    rtc_region: undefined, // voice region id for the voice channel, automatic when set to null
    video_quality_mode: undefined, // the camera video quality mode of the voice channel, 1 when not present
    message_count: undefined, // number of messages (not including the initial message or deleted messages) in a thread.
    member_count: 0, // number an approximate count of users in a thread, stops counting at 50
    default_auto_archive_duration: undefined, // number default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080
    permissions: undefined, //  computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction
    flags: undefined, //  channel flags combined as a bitfield
    total_message_sent: 0, //  number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted};
  };

  @Post('create')
  async create(
    @Req() request: Request<any, any, ChannelType>,
    @Res() response: Response,
  ) {
    const user = useMe(request);
    this.channel
      .create({ ...this.defaultValue, ...request.body }, user.user_id)
      .then((res) => {
        response.status(201).send({
          response: res,
        });
      })
      .catch((err) => {
        response.status(400).send({
          response: err,
        });
      });
  }
  @Put(':parent_id/update')
  async update(
    @Param('parent_id') parent_id: string,
    @Req() request: Request<any, any, ChannelType & { id: string }>,
    @Res() response: Response,
  ) {
    const user = useMe(request);
    this.channel
      .update(parent_id, request.body, user.user_id)
      .then((res) => {
        response.status(201).send({
          response: res,
        });
      })
      .catch((err) => {
        response.status(400).send({
          response: err,
        });
      });
  }
}
