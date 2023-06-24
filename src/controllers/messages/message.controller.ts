import {
      Controller,
      Post,
      Inject,
      Body,
      HttpException,
      HttpStatus,
      HttpCode,
} from '@nestjs/common';

import { MessagesType } from './messages.schema';
import { MessagesService } from './messages.service';

import { UserType } from '@/controllers/person/person';
import { PersonService } from '@/controllers/person/person.service';
import { Profile } from '@/decorators/Profile';
import { SocketGateway } from '@/socket/socket.gateway';

@Controller('messages')
export class MessagesController {
      constructor(
            @Inject(MessagesService) private messages: MessagesService,
            @Inject(PersonService) private profile: PersonService,
            private socketGateway: SocketGateway,
      ) {}

      private defaultMessage = {
            channel_id: '',
            author: undefined,
            content: '',
            timestamp: 0,
            tts: false,
            mention_everyone: false,
            mentions: [],
            mention_roles: [],
            attachments: [],
            pinned: false,
            type: 0,
      };
      @Post('get')
      @HttpCode(200)
      async getMessages(@Body('id') id: string) {
            const getMessages = await this.messages.getChannelMessages(id);
            if (!getMessages) {
                  throw new HttpException(
                        'Error! Cannot get messages',
                        HttpStatus.BAD_REQUEST,
                  );
            }
            return {
                  response: getMessages,
            };
      }

      @Post()
      @HttpCode(204)
      async addMessage(
            @Body() body: MessagesType,
            @Profile() user: CookieProfile,
      ) {
            const myProfile = (await this.profile.getUser({
                  username: user.login,
            })) as Partial<UserType>;

            const message: MessagesType = {
                  ...this.defaultMessage,
                  ...body,
                  author: myProfile,
                  timestamp: +new Date(),
            };

            const createdMessage = await this.messages.create(message);
            if (!createdMessage) {
                  throw new HttpException(
                        'Error! Cannot create messages',
                        HttpStatus.BAD_REQUEST,
                  );
            }

            this.socketGateway.server
                  .to(message.channel_id)
                  .emit('add-message', createdMessage);
            // this.socketServer
            //   .getServer()
            //   .to(message.channel_id)
            //   .emit('add-message', createdMessage);
      }
}
