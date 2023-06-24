import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/controllers/users_guilds/users_guilds.schema';
import {
  Channels,
  ChannelsSchema,
} from '@/controllers/channels/channels.schema';
import { ChannelService } from '@/controllers/channels/channels.service';
import { Messages, MessagesSchema } from './messages.schema';
import { MessagesController } from './message.controller';
import { MessagesService } from './messages.service';
import { Guild, GuildSchema } from '@/controllers/guild/guild.schema';
import { Person, PersonSchema } from '@/controllers/person/person.schema';
import { PersonService } from '@/controllers/person/person.service';
import { SocketGateway } from '@/socket/socket.gateway';

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
  providers: [MessagesService, ChannelService, PersonService, SocketGateway],
})
export class MessageModule {}
