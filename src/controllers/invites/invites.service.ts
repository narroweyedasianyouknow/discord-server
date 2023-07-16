import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { Person } from '../person/person.schema';
import { InviteType, Invites } from './invites.schema';

import { Guild } from '@/controllers/guild/guild.schema';
import { UsersGuilds } from '@/controllers/users_guilds/users_guilds.schema';

@Injectable()
export class InvitesService {
      constructor(
            @InjectModel(Guild.name) private guildModel: Model<Guild>,
            @InjectModel(Person.name) private personModel: Model<Person>,
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
            const { user_id, guild_id } = createInviteDto;

            const errorResponse = new HttpException(
                  { message: 'Bad Request' },
                  HttpStatus.BAD_REQUEST,
            );
            const getProfile = (
                  await this.personModel.findOne({
                        _id: user_id,
                  })
            )?.toJSON({
                  virtuals: true,
                  transform: (doc, ret) => {
                        ret.id = ret._id;
                        delete ret._id;
                        delete ret.__v;
                  },
            });
            if (!getProfile) {
                  throw errorResponse;
            }
            // If exists earlier invite code
            const find = await this.inviteModel.findOne({
                  'inviter.id': user_id,
                  'guild.id': guild_id,
            });
            // If is also doesn't expired
            // Then use it
            if (find && new Date(find.expires_at) > new Date()) return find;

            // Or create new one
            // Check if guild exists
            const checkGuild = (
                  await this.guildModel.findOne({
                        _id: guild_id,
                  })
            )?.toJSON({
                  virtuals: true,
                  transform: (doc, ret) => {
                        ret.id = ret._id;
                        delete ret._id;
                        delete ret.__v;
                  },
            });

            if (!checkGuild || checkGuild.owner_id !== user_id) {
                  throw errorResponse;
            }
            const { password, ...user } = getProfile;
            const generatedCode = this.generateCode(guild_id, user_id, 8);
            const expiresDate = new Date();
            expiresDate.setSeconds(604800);
            const newInviteType: InviteType = {
                  code: generatedCode,
                  inviter: user,
                  guild: checkGuild,
                  approximate_member_count: 0,
                  approximate_presence_count: 0,
                  channel: undefined,
                  expires_at: expiresDate.toISOString(),
                  target_type: 0,
            };
            return new this.inviteModel(newInviteType).save();
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
                  _id: invite.guild?.id,
            });

            // Check if user already exists in this guild
            const checkUsersGuild = await this.usersGuildsModel.findOne({
                  user_id,
                  guild_id: invite.guild?.id,
            });

            //#region Possible Errors

            // If code expired
            if (new Date(invite.expires_at) < new Date()) throw errorResponse;

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
                  guild_id: invite.guild?.id,
            }).save();
            await this.inviteModel.updateOne({
                  user_id,
                  guild_id: invite.guild?.id,
                  used_count: invite.used_count + 1,
            });
            return checkGuild;
      }
}
