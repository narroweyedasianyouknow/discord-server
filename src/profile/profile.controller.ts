import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { useMe } from 'src/funcs/useMe';
import { PostgreSQL } from 'src/postgres';
import { DB_TABLES } from 'src/tables';
@Controller('profile')
export class ProfileController {
  constructor(@Inject(PostgreSQL) private db: PostgreSQL) {}

  @Get()
  async getProfile(@Req() request: Request, @Res() response: Response) {
    log('called');
    const me = useMe(request, response);
    this.db
      .select({
        table: 'person',
        condition: `WHERE login = '${me}'`,
      })
      .then(async (result) => {
        const { password, ...user } = result.rows[0];
        const array: any[] = [];
        for (const id of user.chats) {
          const chat = await this.db.select({
            table: 'chats',
            condition: `WHERE id = '${id}'`,
          });
          if (chat.rows[0]) array.push(chat.rows[0]);
        }
        response.status(200).send({
          ...user,
          chats: array,
        });
      })
      .catch((error) => {
        response.status(400).send(error.stack);
      });
  }
}
