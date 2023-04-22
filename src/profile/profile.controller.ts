import { Controller, Get, Req, Res } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { useMe } from 'src/funcs/useMe';
import { postgres } from 'src/postgres';

@Controller('profile')
export class ProfileController {
  @Get()
  async getProfile(@Req() request: Request, @Res() response: Response) {
    log('called')
    const me = useMe(request, response);
    const pg = await postgres();
    const query = {
      text: `SELECT * FROM person WHERE login = '${me}'`,
    };
    pg.query(query, (error, result) => {
      if (error) {
        response.status(400).send(error.stack);
      } else {
        const { password, ...user } = result.rows[0];
        response.status(200).send(user);
      }
    });
  }
}
