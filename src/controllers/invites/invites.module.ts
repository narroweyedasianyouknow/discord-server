import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Person, PersonSchema } from '../person/person.schema';
import { InvitesController } from './invites.controller';
import { Invites, InvitesSchema } from './invites.schema';
import { InvitesService } from './invites.service';

import { Guild, GuildSchema } from '@/controllers/guild/guild.schema';
import {
      UsersGuilds,
      UsersGuildsSchema,
} from '@/controllers/users_guilds/users_guilds.schema';

@Module({
      imports: [
            MongooseModule.forFeature([
                  { name: Invites.name, schema: InvitesSchema },
                  { name: Guild.name, schema: GuildSchema },
                  { name: UsersGuilds.name, schema: UsersGuildsSchema },
                  { name: Person.name, schema: PersonSchema },
            ]),
      ],
      controllers: [InvitesController],
      providers: [InvitesService],
})
export class InvitesModule {}
