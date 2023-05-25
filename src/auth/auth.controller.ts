import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import errorCodes, { PostgresError } from 'src/errorCodes';
import { fieldsChecker } from 'src/funcs/fieldChecker';
import { scrypt, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { SignIn, SignUp } from './auth';
import { PostgreSQL } from 'src/postgres';
import { DB_TABLES } from 'src/tables';
@Controller('auth')
export class AuthController {
  constructor(@Inject(PostgreSQL) private db: PostgreSQL) {}
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
    // SALT
    const salt = randomBytes(8).toString('hex');

    this.db
      .select({
        table: 'person',
        condition: `WHERE login = "${body?.login}"`,
      })
      .then(() => {
        response.status(500).send({
          response: errorCodes['U-03'],
        });
      })
      .catch((err) => {
        if (err?.code === PostgresError.undefined_column) {
          scrypt(body?.password, salt, 82, (scryptError, derivedKey) => {
            const hashedSaltPassword = `${derivedKey.toString('hex')}.${salt}`;
            this.db
              .insert({
                table: 'person',
                text: `(login, password, chats) VALUES($1, $2, $3)`,
                values: [body?.login, hashedSaltPassword, []],
              })
              .then(() => {
                if (process.env.SECRET) {
                  const token = sign(
                    {
                      login: body?.login,
                    },
                    process.env.SECRET,
                    {
                      expiresIn: 864e5,
                    },
                  );
                  response.cookie('token', token, {
                    expires: this.expiresAge(),
                  });
                }
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
          });
        }
      });
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

    const db = this.db.getServerInstantce();
    db.query(
      `SELECT * FROM ${DB_TABLES.PERSON} WHERE login = '${login}'`,
      (e, res) => {
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
      },
    );
  }
}
