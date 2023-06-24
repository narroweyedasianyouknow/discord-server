import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { MessagesType, Messages } from './messages.schema';

import { Channels } from '@/controllers/channels/channels.schema';

@Injectable()
export class MessagesService {
      constructor(
            @InjectModel(Messages.name) private messages: Model<Messages>,
            @InjectModel(Channels.name) private channel: Model<Channels>,
      ) {}
      // async myProfile(args: { username?: string; user_id?: string }) {
      //   return this.user.findOne(args).lean().exec();
      // }

      async checkAccess(data: { id?: string; owner_id?: string }) {
            const iHaveAccess = await this.messages
                  .findOne({
                        owner_id: data.owner_id,
                        _id: data.id,
                  })
                  .lean(true)
                  .exec();
            return iHaveAccess;
      }
      async create(createChannelDto: MessagesType) {
            const createdPerson = new this.messages(createChannelDto);
            return createdPerson.save();
      }

      async findAll(): Promise<MessagesType[]> {
            return this.messages.find().exec();
      }
      async findGuilds(ids: string[]): Promise<MessagesType[]> {
            const request = await this.messages
                  .find()
                  .where('_id')
                  .in(ids)
                  .lean()
                  .exec();
            return request;
      }

      async update(id: string, updateData: MessagesType, user_id: string) {
            const iHaveAccess = await this.checkAccess({
                  owner_id: user_id,
                  id: id,
            });
            if (iHaveAccess) {
                  return this.messages.findOneAndUpdate(
                        { _id: id },
                        updateData,
                  );
            } else {
                  return false;
            }
      }
      async getChannelMessages(id: string) {
            const messages = this.messages
                  .find({ channel_id: id })
                  .sort({ timestamp: -1 })
                  .limit(25)
                  .exec();
            return messages;
      }
}
