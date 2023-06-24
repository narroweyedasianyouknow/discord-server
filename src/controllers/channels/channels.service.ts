import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Channels } from './channels.schema';
import { ChannelType } from './channels';
import { Guild } from '@/controllers/guild/guild.schema';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Guild.name) private guild: Model<Guild>,
    @InjectModel(Channels.name) private channel: Model<Channels>,
  ) {}
  // async myProfile(args: { username?: string; user_id?: string }) {
  //   return this.user.findOne(args).lean().exec();
  // }

  async checkAccess(data: { id?: string; owner_id?: string }) {
    const iHaveAccess = await this.guild
      .findOne({
        owner_id: data.owner_id,
        _id: data.id,
      })
      .lean(true)
      .exec();
    return iHaveAccess;
  }
  async create(createChannelDto: ChannelType, user_id: string) {
    // const user = await this.myProfile(userData);
    const iHaveAccess = await this.checkAccess({
      owner_id: user_id,
      id: createChannelDto.guild_id,
    });
    if (iHaveAccess) {
      const createdPerson = new this.channel(createChannelDto);
      return createdPerson.save();
    } else {
      return false;
    }
  }

  async findAll(): Promise<ChannelType[]> {
    return this.channel.find().exec();
  }
  async findGuilds(ids: string[]): Promise<ChannelType[]> {
    const request = await this.channel
      .find()
      .where('_id')
      .in(ids)
      .lean()
      .exec();
    return request;
  }

  async update(id: string, updateData: ChannelType, user_id: string) {
    const iHaveAccess = await this.checkAccess({
      owner_id: user_id,
      id: id,
    });
    if (iHaveAccess) {
      return this.channel.findOneAndUpdate({ _id: id }, updateData);
    } else {
      return false;
    }
  }
}
