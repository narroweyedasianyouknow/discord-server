import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import errorCodes, { PostgresError } from 'src/errorCodes';
import { fieldsChecker } from 'src/funcs/fieldChecker';
import { useMe } from 'src/funcs/useMe';
import { PostgreSQL } from 'src/postgres';
import { SocketIoServer } from 'src/socket-io.server';
import { DB_TABLES } from 'src/tables';

@Controller('chats')
export class ChatsController {
  constructor(
    @Inject(PostgreSQL) private db: PostgreSQL,
    @Inject(SocketIoServer) private socketServer: SocketIoServer,
  ) {}

  @Post()
  async joinChat(
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
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        id: 'string',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    this.db
      .update({
        table: `chats`,
        text: `SET chats = array_append(chats, '${id}')`,
        condition: `WHERE user_id = '${me}'`,
      })
      .catch((err) => {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      })
      .then(() => {
        response.status(200).send({
          response: true,
        });
        this.socketServer.getServer().to(id).emit('joined-chat', {
          user: me,
        });
      });
  }
  @Post('create')
  async createChat(
    @Req()
    request: Request<
      any,
      any,
      {
        id: string;
        title: string;
        avatar?: string;
      }
    >,
    @Res() response: Response,
  ) {
    const { title } = request.body;
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        title: 'string',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    if (me) {
      const joinEmit = () => {
        this.db.update({
          table: `person`,
          text: `SET chats = array_append(chats, '${title}')`,
          condition: `WHERE login = '${me}'`,
        });
        this.socketServer.getServer().to(title).emit('joined-chat', {
          user: me,
        });
      };
      this.db
        .insert({
          table: 'chats',
          text: '(id, title, created_by) VALUES($1, $2, $3)',
          values: [title, title, me],
        })
        .then(() => {
          joinEmit();
          response.status(200).send({
            response: {
              id: title,
              title: title,
              created_by: me,
              avatar: '',
            },
          });
        })
        .catch((err) => {
          console.log(err);
          if ('code' in err && err.code === PostgresError.unique_violation) {
            joinEmit();

            response.status(200).send({
              response: {
                id: title,
                title: title,
                created_by: me,
                avatar: '',
              },
            });
          }
        });
    } else
      response.status(401).send({
        // error: err.stack,
        response: false,
      });
  }
}
