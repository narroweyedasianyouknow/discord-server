import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SocketStore } from 'src/SocketStore';
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
    @Inject(SocketStore) private socketStore: SocketStore,
  ) {}
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
      this.db.update({
        table: `person`,
        text: `SET chats = array_append(chats, '${title}')`,
        condition: `WHERE login = '${me}'`,
      });
      const server = this.socketStore.getUserSocket(me);
      server?.join(title);
      this.db
        .insert({
          table: 'chats',
          text: '(id, title, created_by) VALUES($1, $2, $3)',
          values: [title, title, me],
        })
        .then(() => {
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
          if ('code' in err && err.code === PostgresError.unique_violation) {
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
