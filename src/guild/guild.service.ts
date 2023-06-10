import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guild } from './guild.schema';
import type { GuildType } from './guild.schema';
import type { Model } from 'mongoose';
import { Channels } from '@/channels/channels.schema';
import { CHANNEL_TYPES_LIST, ChannelType } from '@/channels/channels';
import { Roles } from '@/roles/roles.schema';

@Injectable()
export class GuildService {
  constructor(
    @InjectModel(Guild.name) private model: Model<Guild>,
    @InjectModel(Channels.name) private channel: Model<Channels>,
    @InjectModel(Roles.name) private rolesModel: Model<Roles>,
  ) {}

  async create(createPersonDto: GuildType) {
    const createdGuild = new this.model(createPersonDto);
    const channelsCategory: ChannelType = {
      channel_type: CHANNEL_TYPES_LIST.GUILD_CATEGORY,
      name: 'text channel',
      guild_id: createdGuild.id,
    };
    const categoryReq = await new this.channel(channelsCategory).save();
    const channelsMainChannel: ChannelType = {
      channel_type: CHANNEL_TYPES_LIST.GUILD_TEXT,
      name: 'general',
      guild_id: createdGuild.id,
      parent_id: categoryReq.id,
    };
    await new this.channel(channelsMainChannel).save();
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
