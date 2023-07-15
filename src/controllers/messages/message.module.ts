import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
      VoiceSession,
      VoiceSessionSchema,
} from '../voiceSessions/voiceSessions.schema';
import { VoiceSessionService } from '../voiceSessions/voiceSessions.service';
import { MessagesController } from './message.controller';
import { Messages, MessagesSchema } from './messages.schema';
import { MessagesService } from './messages.service';

import {
      Channels,
      ChannelsSchema,
} from '@/controllers/channels/channels.schema';
import { ChannelService } from '@/controllers/channels/channels.service';
import { Guild, GuildSchema } from '@/controllers/guild/guild.schema';
import { Person, PersonSchema } from '@/controllers/person/person.schema';
import { PersonService } from '@/controllers/person/person.service';
import {
      UsersGuilds,
      UsersGuildsSchema,
} from '@/controllers/users_guilds/users_guilds.schema';
import { SocketGateway } from '@/socket/socket.gateway';

@Module({
      imports: [
            MongooseModule.forFeature([
                  { name: Messages.name, schema: MessagesSchema },
                  { name: Guild.name, schema: GuildSchema },
                  { name: UsersGuilds.name, schema: UsersGuildsSchema },
                  { name: Channels.name, schema: ChannelsSchema },
                  { name: Person.name, schema: PersonSchema },
                  {
                        name: VoiceSession.name,
                        schema: VoiceSessionSchema,
                  },
            ]),
      ],
      controllers: [MessagesController],
      providers: [
            MessagesService,
            ChannelService,
            PersonService,
            SocketGateway,
            VoiceSessionService,
      ],
})
export class MessageModule {}
