import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { Invites } from './invites.schema';

import { Guild } from '@/controllers/guild/guild.schema';
import { UsersGuilds } from '@/controllers/users_guilds/users_guilds.schema';

@Injectable()
export class InvitesService {
      constructor(
            @InjectModel(Guild.name) private guildModel: Model<Guild>,
            @InjectModel(Invites.name) private inviteModel: Model<Invites>,
            @InjectModel(UsersGuilds.name)
            private usersGuildsModel: Model<UsersGuilds>,
      ) {}

      private generateCode(guild_id: string, user_id: string, length: number) {
            const characters =
                  `${guild_id}${user_id}ABCDEFGHIJKLMNOPQRSTUVWXYZ` +
                  `${guild_id}${user_id}abcdefghijklmnopqrstuvwxyz` +
                  `${guild_id}${user_id}0123456789`;
            let result = '';

            for (let i = 0; i < length; i++) {
                  const randomIndex = Math.floor(
                        Math.random() * characters.length,
                  );
                  result += characters.charAt(randomIndex);
            }

            return result;
      }

      async create(createInviteDto: { guild_id: string; user_id: string }) {
            const { guild_id, user_id } = createInviteDto;

            const errorResponse = new HttpException(
                  { message: 'Bad Request' },
                  HttpStatus.BAD_REQUEST,
            );

            // Check if guild exists
            const checkGuild = await this.guildModel.findOne({
                  _id: guild_id,
            });

            if (!checkGuild || checkGuild.owner_id !== user_id) {
                  throw errorResponse;
            }
            const generatedCode = this.generateCode(guild_id, user_id, 8);
            return new this.inviteModel({
                  code: generatedCode,
                  user_id,
                  guild_id,
                  used_count: 0,
                  max_used_count: 100,
            }).save();
      }

      async useInvite(props: { code: string; user_id: string }) {
            const { code, user_id } = props;

            const errorResponse = new HttpException(
                  { message: 'Bad Request' },
                  HttpStatus.BAD_REQUEST,
            );

            // Check if invite exists
            const invite = await this.inviteModel.findOne({ code });
            if (!invite) throw errorResponse;
            // Check if guild exists
            const checkGuild = await this.guildModel.findOne({
                  _id: invite.guild_id,
            });

            // Check if user already exists in this guild
            const checkUsersGuild = await this.usersGuildsModel.findOne({
                  user_id,
                  guild_id: invite.guild_id,
            });

            //#region Possible Errors

            // If code expired
            if (invite.expires < +new Date()) throw errorResponse;

            // If guild doesn't exists
            if (!checkGuild?.id) throw errorResponse;

            // If user already in this guild
            if (checkUsersGuild) throw errorResponse;

            if (invite.used_count === invite.max_used_count) {
                  throw errorResponse;
            }
            //#endregion

            await new this.usersGuildsModel({
                  user_id,
                  guild_id: invite.guild_id,
            }).save();
            await this.inviteModel.updateOne({
                  user_id,
                  guild_id: invite.guild_id,
                  used_count: invite.used_count + 1,
            });
            return checkGuild;
      }
}
