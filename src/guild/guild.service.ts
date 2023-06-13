import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guild } from './guild.schema';
import type { GuildType } from './guild.schema';
import type { Model } from 'mongoose';
import { Channels } from '@/channels/channels.schema';
import { CHANNEL_TYPES_LIST, ChannelType } from '@/channels/channels';
import { Roles } from '@/roles/roles.schema';
import { SocketStore } from '@/SocketStore';

@Injectable()
export class GuildService {
  constructor(
    @InjectModel(Guild.name) private model: Model<Guild>,
    @InjectModel(Channels.name) private channel: Model<Channels>,
  ) {}
  // @InjectModel(Roles.name) private rolesModel: Model<Roles>,

  async create(createGuildDto: GuildType) {
    const createdGuild = new this.model(createGuildDto);
    const channelsCategory: ChannelType = {
      channel_type: CHANNEL_TYPES_LIST.GUILD_CATEGORY,
      name: 'text channel',
      guild_id: createdGuild.id,
    };
    const categoryReq = await (
      await new this.channel(channelsCategory).save()
    ).toJSON({
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    });
    const channelsMainChannel: ChannelType = {
      channel_type: CHANNEL_TYPES_LIST.GUILD_TEXT,
      name: 'general',
      guild_id: createdGuild.id,
      parent_id: categoryReq.id,
    };
    const textChannelReq = (
      await new this.channel(channelsMainChannel).save()
    ).toJSON({
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    });
    const guildResult = await createdGuild.save();

    return {
      ...guildResult.toJSON({
        virtuals: true,
        transform: (doc, ret) => {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
      }),
      channels: [categoryReq, textChannelReq],
    };
  }

  async findAll(): Promise<GuildType[]> {
    return this.model.find().exec();
  }

  async getGuildChannels(
    guild_id: string,
  ): Promise<(ChannelType & { id: string })[]> {
    const channels = (await this.channel
      .find({
        guild_id: guild_id,
      })
      .exec()) as (ChannelType & { id: string })[];
    return channels;
  }
  async findGuild(id: string): Promise<GuildType> {
    const request = await this.model.findOne({ _id: id }).exec();
    const channels = await this.getGuildChannels(id);
    const promise = {
      ...request,
      channels,
    } as GuildType;
    return promise;
  }
  async findGuildsList(ids: string[]): Promise<GuildType[]> {
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
