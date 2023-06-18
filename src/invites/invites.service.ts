import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Guild } from '@/guild/guild.schema';
import { Invites, InvitesType } from './invites.schema';
import { UsersGuilds } from '@/users_guilds/users_guilds.schema';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(Guild.name) private guildModel: Model<Guild>,
    @InjectModel(Invites.name) private inviteModel: Model<Invites>,
    @InjectModel(UsersGuilds.name) private usersGuildsModel: Model<UsersGuilds>,
  ) {}

  // async create(createGuildDto: InviteType) {}

  async useInvite(props: { code: string; guild_id: string; user_id: string }) {
    const { code, guild_id, user_id } = props;

    const errorResponse = new HttpException(
      { message: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );
    // Check if guild exists
    const checkGuild = await this.guildModel.findOne({ id: guild_id });

    // Check if guild exists
    const checkInvite = await this.inviteModel.findOne({ code });

    // Check if user already exists in this guild
    const checkUsersGuild = await this.usersGuildsModel.findOne({
      user_id,
      guild_id,
    });

    //#region Possible Errors
    if (!checkInvite) throw errorResponse;

    // If code expired
    if (checkInvite.expires < +new Date()) throw errorResponse;

    // If guild doesn't exists
    if (!checkGuild?.id) throw errorResponse;

    // If user already in this guild
    if (checkUsersGuild) throw errorResponse;

    if (checkInvite.used_count === checkInvite.max_used_count) {
      throw errorResponse;
    }
    //#endregion

    await new this.usersGuildsModel({
      user_id,
      guild_id,
    }).save();
    await this.inviteModel.updateOne({
      user_id,
      guild_id,
      used_count: checkInvite.used_count + 1,
    });
    return checkGuild;
  }
}
