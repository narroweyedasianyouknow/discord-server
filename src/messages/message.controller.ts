import { Controller, Post, Req, Res, Put, Inject, Body } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SocketIoServer } from 'src/socket-io.server';
import { MessagesType } from './messages.schema';
import { MessagesService } from './messages.service';
import { PersonService } from '@/person/person.service';
import { UserType } from '@/person/person';
import { Profile } from '@/decorators/Profile';

@Controller('messages')
export class MessagesController {
  constructor(
    @Inject(MessagesService) private messages: MessagesService,
    @Inject(PersonService) private profile: PersonService,
    @Inject(SocketIoServer) private socketServer: SocketIoServer,
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
  async getMessages(@Body('id') id: string, @Res() response: Response) {
    this.messages
      .getChannelMessages(id)
      .then((res) => {
        response.status(200).send({
          response: res,
        });
      })
      .catch((err) => {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      });
  }

  @Post()
  async addMessage(
    @Body() body: MessagesType,
    @Res() response: Response,
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
    this.messages
      .create(message)
      .then((res) => {
        this.socketServer
          .getServer()
          .to(message.channel_id)
          .emit('add-message', res);
        response.status(201).send(res);
      })
      .catch((err) => {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      });
  }
  // @Put()
  // async edit(
  //   @Req()
  //   request: Request<any, any, IMessage>,
  //   @Res() response: Response,
  // ) {
  //   const { id } = request.body;
  //   const me = useMe(request);
  //   const isOk = fieldsChecker(
  //     request.body,
  //     {
  //       id: 'number',
  //     },
  //     response,
  //   );
  //   if (!isOk) {
  //     return;
  //   }

  //   const body = {
  //     name: request.body?.text_content,
  //   };

  //   this.db
  //     .update({
  //       table: 'message',
  //       text: `SET ${this.db.setByKeys(Object.values(body))}`,
  //       condition: `WHERE id = ${id} AND created_by = '${me}'`,
  //     })
  //     .then(() => {
  //       response.status(200).send({
  //         response: true,
  //       });
  //     })
  //     .catch((err) => {
  //       response.status(500).send({
  //         error: err.stack,
  //         response: false,
  //       });
  //     });
  // }
}
