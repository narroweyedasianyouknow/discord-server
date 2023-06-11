import { Controller, Post, Req, Res, Put, Inject } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { IMessage } from './message';
import type { Request, Response } from 'express';
import { fieldsChecker } from 'src/funcs/fieldChecker';
import { useMe } from 'src/funcs/useMe';
import { PostgreSQL } from 'src/postgres';
import { SocketIoServer } from 'src/socket-io.server';
import { MessagesType } from './messages.schema';
import { MessagesService } from './messages.service';
import { PersonService } from '@/person/person.service';
import { UserType } from '@/person/person';

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
  async getMessages(
    @Req()
    request: Request<
      any,
      any,
      {
        id: string;
      }
    >,
    @Res() response: Response,
  ) {
    const { id } = request.body;
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
    @Req()
    request: Request<any, any, MessagesType>,
    @Res() response: Response,
  ) {
    const me = useMe(request);
    const myProfile = (await this.profile.getUser({
      username: me.login,
    })) as Partial<UserType>;

    const message = {
      ...this.defaultMessage,
      ...request.body,
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
