import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guild } from './guild.schema';
import type { GuildType } from './guild.schema';
import type { Model } from 'mongoose';

@Injectable()
export class GuildService {
  constructor(@InjectModel(Guild.name) private personModel: Model<Guild>) {}

  async create(createPersonDto: GuildType) {
    const createdPerson = new this.personModel(createPersonDto);
    return createdPerson.save();
  }

  async findAll(): Promise<GuildType[]> {
    return this.personModel.find().exec();
  }
  async findGuilds(ids: string[]): Promise<GuildType[]> {
    const request = await this.personModel
      .find()
      .where('_id')
      .in(ids)
      .lean()
      .exec();
    return request.map(function (v) {
      v['id'] = v['_id'];
      delete v['_id'];
      delete v['__v'];
      return v;
    });
  }
  async findMyChats(id: string) {
    const request = await this.personModel.find({ owner_id: id }).lean().exec();
    return request.map(function (v) {
      const { _id, __v, ...chat } = v;
      return chat;
    });
  }

  async update(props: GuildType & { id: string }) {
    const { id, ...person } = props;
    return this.personModel.updateOne(
      {
        _id: id,
      },
      person,
    );
  }
}
