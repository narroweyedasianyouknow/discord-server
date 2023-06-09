import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guild } from './guild.schema';
import type { GuildType } from './guild.schema';
import type { Model } from 'mongoose';
import { Channels } from '@/channels/channels.schema';
import { CHANNEL_TYPES_LIST, ChannelType } from '@/channels/channels';
import { UsersChannels } from '@/users_channels/users_channels.schema';

@Injectable()
export class GuildService {
  constructor(
    @InjectModel(Guild.name) private model: Model<Guild>,
    @InjectModel(Channels.name) private channel: Model<Channels>,
    @InjectModel(UsersChannels.name) private usersChannel: Model<UsersChannels>,
  ) {}

  async create(createPersonDto: GuildType) {
    const createdGuild = new this.model(createPersonDto);
    const channelsCategory: ChannelType = {
      channel_type: CHANNEL_TYPES_LIST.GUILD_CATEGORY,
      name: 'text channel',
      guild_id: createdGuild.id,
    };
    await new this.channel(channelsCategory).save().then((res) => {
      const channelsMainChannel: ChannelType = {
        channel_type: CHANNEL_TYPES_LIST.GUILD_TEXT,
        name: 'general',
        guild_id: createdGuild.id,
        parent_id: res.id,
      };
      new this.channel(channelsMainChannel).save().then((textChannel) => {
        // new this.usersChannel({
        //   channel_id: textChannel.id,
        //   guilds_id: channelsCategory.owner_id,
        // }).save();
      });
    });
    return createdGuild.save();
  }

  async findAll(): Promise<GuildType[]> {
    return this.model.find().exec();
  }
  async findGuilds(ids: string[]): Promise<GuildType[]> {
    const request = await this.model.find().where('_id').in(ids).lean().exec();

    const promise = Promise.all(
      request.map(async (v) => {
        const { __v, _id, ...guild } = v;
        const channels = this.channel
          .find({
            guild_id: _id,
          })
          .lean()
          .exec();
        return {
          ...guild,
          id: _id,
          channels: (await channels).map((v) => {
            v.id = v._id;
            delete v._id;
            delete v.__v;
            return v;
          }),
        };
      }),
    );
    return promise;
  }
  async findMyChats(id: string) {
    const request = await this.model.find({ owner_id: id }).lean().exec();
    return request.map(function (v) {
      const { _id, __v, ...chat } = v;
      return chat;
    });
  }

  async update(props: GuildType & { id: string }) {
    const { id, ...person } = props;
    return this.model.updateOne(
      {
        _id: id,
      },
      person,
    );
  }
}
