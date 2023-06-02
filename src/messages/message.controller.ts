import { Controller, Post, Req, Res, Put, Inject } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { IMessage } from './message';
import type { Request, Response } from 'express';
import { fieldsChecker } from 'src/funcs/fieldChecker';
import { useMe } from 'src/funcs/useMe';
import { PostgreSQL } from 'src/postgres';
import { SocketIoServer } from 'src/socket-io.server';

@Controller('message')
export class MessageController extends IoAdapter {
  constructor(
    @Inject(PostgreSQL) private db: PostgreSQL,
    @Inject(SocketIoServer) private socketServer: SocketIoServer,
  ) {
    super();
  }

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
      .select({
        table: 'message',
        condition: `WHERE subject_id = '${id}'`,
      })
      .then((result) => {
        response.status(200).send({
          response: result.rows,
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
    request: Request<any, any, IMessage>,
    @Res() response: Response,
  ) {
    const { id, subject_id, text_content, ts } = request.body;
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        id: 'string',
        subject_id: 'string',
        text_content: 'string',
        ts: 'number',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    const values = 'id, subject_id, text_content, user_id, user_name, ts';

    this.db
      .insert({
        table: 'message',
        text: `(${values}) VALUES($1, $2, $3, $4, $5, $6)`,
        values: [id, subject_id, text_content, me, me, ts],
      })
      .then(() => {
        this.socketServer.getServer().to(subject_id).emit('add-message', {
          id,
          subject_id,
          text_content,
          user_id: me,
          user_name: me,
          ts,
        });
        response.status(200).send({
          response: true,
        });
      })
      .catch((err) => {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      });
  }
  @Put()
  async edit(
    @Req()
    request: Request<any, any, IMessage>,
    @Res() response: Response,
  ) {
    const { id } = request.body;
    const me = useMe(request, response);
    const isOk = fieldsChecker(
      request.body,
      {
        id: 'number',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    const body = {
      name: request.body?.text_content,
    };

    this.db
      .update({
        table: 'message',
        text: `SET ${this.db.setByKeys(Object.values(body))}`,
        condition: `WHERE id = ${id} AND created_by = '${me}'`,
      })
      .then(() => {
        response.status(200).send({
          response: true,
        });
      })
      .catch((err) => {
        response.status(500).send({
          error: err.stack,
          response: false,
        });
      });
  }
}
