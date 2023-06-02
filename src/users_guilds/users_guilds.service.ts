import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersGuilds } from './users_guilds.schema';
import type { UsersGuildsType } from './users_guilds';
import type { Model } from 'mongoose';

@Injectable()
export class UserGuildsService {
  constructor(
    @InjectModel(UsersGuilds.name) private usersGuildsModel: Model<UsersGuilds>,
  ) {}

  async create(createPersonDto: UsersGuildsType) {
    const createdPerson = new this.usersGuildsModel(createPersonDto);
    return createdPerson.save();
  }

  async findMyGuilds(user_id: string): Promise<string[]> {
    const list = await this.usersGuildsModel
      .find({
        user_id: user_id,
      })
      .lean()
      .exec();
    if (!list) return [];
    return list.map((v) => v.guild_id);
  }
}
