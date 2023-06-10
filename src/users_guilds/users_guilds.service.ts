import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersGuilds } from './users_guilds.schema';
import type { UsersGuildsType } from './users_guilds';
import type { Model } from 'mongoose';
import { PERMISSIONS_LIST } from '@/roles/roles.schema';

export const DEFAULT_PERMISSION = String(
  PERMISSIONS_LIST.VIEW_CHANNEL +
    PERMISSIONS_LIST.CREATE_INSTANT_INVITE +
    PERMISSIONS_LIST.CHANGE_NICKNAME +
    PERMISSIONS_LIST.SEND_MESSAGES +
    PERMISSIONS_LIST.SEND_MESSAGES_IN_THREADS +
    PERMISSIONS_LIST.CREATE_PUBLIC_THREADS +
    PERMISSIONS_LIST.CREATE_PRIVATE_THREADS +
    PERMISSIONS_LIST.EMBED_LINKS +
    PERMISSIONS_LIST.ATTACH_FILES +
    PERMISSIONS_LIST.ADD_REACTIONS +
    PERMISSIONS_LIST.USE_EXTERNAL_EMOJIS +
    PERMISSIONS_LIST.MENTION_EVERYONE +
    PERMISSIONS_LIST.READ_MESSAGE_HISTORY +
    PERMISSIONS_LIST.SEND_VOICE_MESSAGES +
    PERMISSIONS_LIST.SPEAK +
    PERMISSIONS_LIST.USE_EXTERNAL_SOUNDS,
);

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
