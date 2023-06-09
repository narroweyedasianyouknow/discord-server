import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UsersChannels, UsersChannelsType } from './users_channels.schema';

@Injectable()
export class UserGuildsService {
  constructor(
    @InjectModel(UsersChannels.name)
    private usersGuildsModel: Model<UsersChannels>,
  ) {}

  async create(createPersonDto: UsersChannelsType) {
    const createdPerson = new this.usersGuildsModel(createPersonDto);
    return createdPerson.save();
  }

  async findMyChannels(user_id: string): Promise<string[]> {
    const list = await this.usersGuildsModel
      .find({
        user_id: user_id,
      })
      .lean()
      .exec();
    if (!list) return [];
    return list.map((v) => v.channel_id);
  }
}
