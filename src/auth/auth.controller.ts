import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import errorCodes, { PostgresError } from 'src/errorCodes';
import { fieldsChecker } from 'src/funcs/fieldChecker';
import { postgres } from 'src/postgres';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { sign } from 'jsonwebtoken';
import { SignIn, SignUp } from './auth';
@Controller('auth')
export class AuthController {
  expiresAge = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };
  @Post('sign-up')
  async signUp(
    @Req() request: Request<any, any, SignUp>,
    @Res() response: Response,
  ) {
    const body = request.body;
    const isOk = fieldsChecker(
      body,
      {
        login: 'string',
        password: 'string',
      },
      response,
    );
    if (!isOk) {
      return;
    }

    const pg = await postgres();
    // SALT
    const salt = randomBytes(8).toString('hex');

    pg.query(
      `SELECT * FROM person WHERE login = "${body?.login}"`,
      (e, result) => {
        if ('code' in e && e?.code === PostgresError.undefined_column) {
          scrypt(body?.password, salt, 82, (scryptError, derivedKey) => {
            const hashedSaltPassword = `${derivedKey.toString('hex')}.${salt}`;
            const query = {
              text: 'INSERT INTO person(login, password) VALUES($1, $2)',
              values: [body?.login, hashedSaltPassword],
            };
            pg.query(query, async (err) => {
              if (err) {
                response.status(500).send({
                  error: err.stack,
                  response: false,
                });
              } else {
                response.status(200).send({
                  response: true,
                });
              }
            });
            console.log(hashedSaltPassword);
          });
        } else {
          response.status(500).send({
            response: e.stack,
          });
        }
      },
    );

    return 'aa';
  }
  @Post('sign-in')
  async signIn(
    @Req()
    request: Request<any, any, SignIn>,
    @Res() response: Response,
  ) {
    const isOk = fieldsChecker(
      request.body,
      {
        login: 'string',
        password: 'string',
      },
      response,
    );
    if (!isOk) {
      return;
    }
    const { password, login } = request.body;

    const pg = await postgres();
    pg.query(`SELECT * FROM person WHERE login = '${login}'`, (e, res) => {
      if (res?.rows && res?.rows[0]) {
        const user = res?.rows[0];
        const [hashed, salt] = user?.password.split('.');
        scrypt(password, salt, 82, (e, derivedKey) => {
          const isValid = hashed === derivedKey.toString('hex');
          if (isValid && process.env?.SECRET) {
            const token = sign(
              {
                login,
              },
              process.env.SECRET,
              {
                expiresIn: 864e5,
              },
            );
            response.cookie('token', token, {
              expires: this.expiresAge(),
            });
            response.status(200).send(true);
          } else {
            response.status(400).send(errorCodes['U-01']);
          }
        });
      } else {
        response.status(400).send(errorCodes['U-02']);
      }
    });
  }
}
