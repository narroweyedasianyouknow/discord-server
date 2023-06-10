import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/users_guilds/users_guilds.schema';
import { UserGuildsService } from '@/users_guilds/users_guilds.service';
import { Channels, ChannelsSchema } from '@/channels/channels.schema';
import { ChannelService } from '@/channels/channels.service';
import { Messages, MessagesSchema } from './messages.schema';
import { MessagesController } from './message.controller';
import { MessagesService } from './messages.service';
import { SocketIoServer } from '@/socket-io.server';
import { Guild, GuildSchema } from '@/guild/guild.schema';
import { SocketStore } from '@/SocketStore';
import { Person, PersonSchema } from '@/person/person.schema';
import { PersonService } from '@/person/person.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
      { name: Guild.name, schema: GuildSchema },
      { name: UsersGuilds.name, schema: UsersGuildsSchema },
      { name: Channels.name, schema: ChannelsSchema },
      { name: Person.name, schema: PersonSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    ChannelService,
    PersonService,
    SocketIoServer,
    SocketStore,
  ],
})
export class MessageModule {}
