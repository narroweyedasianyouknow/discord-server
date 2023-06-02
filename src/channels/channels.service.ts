import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Channels } from './channels.schema';
import { ChannelType } from './channels';

@Injectable()
export class ChannelService {
  constructor(@InjectModel(Channels.name) private model: Model<Channels>) {}

  async create(createPersonDto: ChannelType) {
    const createdPerson = new this.model(createPersonDto);
    return createdPerson.save();
  }

  async findAll(): Promise<ChannelType[]> {
    return this.model.find().exec();
  }
  async findGuilds(ids: string[]): Promise<ChannelType[]> {
    const request = await this.model.find().where('_id').in(ids).lean().exec();
    return request.map(function (v) {
      v['id'] = v['_id'];
      delete v['_id'];
      delete v['__v'];
      return v;
    });
  }

  async update(props: ChannelType & { id: string }) {
    const { id, ...person } = props;
    return this.model.updateOne(
      {
        _id: id,
      },
      person,
    );
  }
}
