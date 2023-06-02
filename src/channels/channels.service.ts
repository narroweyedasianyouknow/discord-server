import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Channels } from './channels.schema';
import { ChannelType } from './channels';
import { Guild } from '@/guild/guild.schema';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Guild.name) private guild: Model<Guild>,
    @InjectModel(Channels.name) private channel: Model<Channels>,
  ) {}
  // async myProfile(args: { username?: string; user_id?: string }) {
  //   return this.user.findOne(args).lean().exec();
  // }

  async create(
    createChannelDto: ChannelType,
    userData: { username?: string; user_id?: string },
  ) {
    // const user = await this.myProfile(userData);
    const iHaveAccess = await this.guild
      .findOne({
        owner_id: userData.user_id,
        _id: createChannelDto.parent_id,
      })
      .lean(true)
      .exec();
    console.log(iHaveAccess, userData.user_id);
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

  async update(props: ChannelType & { id: string }) {
    const { id, ...person } = props;
    return this.channel.updateOne(
      {
        _id: id,
      },
      person,
    );
  }
}
