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
      .then((result) => {
        const { password, ...user } = result.rows[0];
        response.status(200).send(user);
      })
      .catch((error) => {
        response.status(400).send(error.stack);
      });
  }
}
