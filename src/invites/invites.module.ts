import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invites, InvitesSchema } from './invites.schema';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { Guild, GuildSchema } from '@/guild/guild.schema';
import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/users_guilds/users_guilds.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invites.name, schema: InvitesSchema },
      { name: Guild.name, schema: GuildSchema },
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
    ]),
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
