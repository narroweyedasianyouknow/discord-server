import { scrypt, randomBytes } from 'crypto';
import { Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { PersonService } from './person.service';
import type { Request, Response } from 'express';
import { MONGOOSE_ERRORS } from 'src/errorCodes';
import { useMe } from '@/funcs/useMe';

@Controller('person')
export class PersonController {
  constructor(@Inject(PersonService) private person: PersonService) {}
  expiresAge = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  validateEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }
  randomHex() {
    const pat = (val: number) => val.toString(16);
    const r = pat(Math.floor(Math.random() * 255));
    const g = pat(Math.floor(Math.random() * 255));
    const a = pat(Math.floor(Math.random() * 255));
    return `${r}${g}${a}`;
  }
  private defaultUser = {
    avatar: '', //	the user's avatar hash	identify
    bot: false, //	whether the user belongs to an OAuth2 application	identify
    system: false, //	whether the user is an Official Discord System user (part of the urgent message system)	identify
    mfa_enabled: false, //	whether the user has two factor enabled on their account	identify
    banner: '', //	the user's banner hash	identify
    accent_color: 0, //	the user's banner color encoded as an integer representation of hexadecimal color code	identify
    locale: '', //	the user's chosen language option	identify
    verified: false, //	whether the email on this account has been verified	email
    email: '', //	the user's email	email
  };

  @Post('/create')
  async signUp(
    @Req()
    request: Request<
      any,
      any,
      {
        username: string;
        email: string;
        password: string;
        locale: string;
      }
    >,
    @Res() response: Response,
  ) {
    const { email, username, password, locale } = request.body;
    // SALT
    const salt = randomBytes(8).toString('hex');

    scrypt(password, salt, 82, (scryptError, derivedKey) => {
      const hashedSaltPassword = `${derivedKey.toString('hex')}.${salt}`;

      // The following restrictions are additionally enforced for usernames:

      // Usernames cannot contain the following substrings: @, #, :, ```, discord
      // Usernames cannot be: everyone, here
      const user = {
        ...this.defaultUser,
        username: username, //	the user's username, not unique across the platform	identify
        email: email,
        locale: locale,
        accent_color: this.randomHex(),
      };
      this.person
        .create({ ...user, password: hashedSaltPassword })
        .then((res) => {
          if (process.env.SECRET) {
            const token = sign(
              {
                login: user.username,
                user_id: res._id,
              },
              process.env.SECRET,
              {
                expiresIn: 864e5,
              },
            );
            response.cookie('token', token, {
              expires: this.expiresAge(),
            });
            response.status(201).send({
              response: { ...user, id: res._id },
            });
          }
        })
        .catch(
          (err: {
            message: any;
            code: keyof typeof MONGOOSE_ERRORS;
            keyValue: Record<string, string>;
          }) => {
            const errCode = err.code;
            if (errCode in MONGOOSE_ERRORS && MONGOOSE_ERRORS[errCode]) {
              response.status(401).send({
                response: MONGOOSE_ERRORS[errCode](err?.keyValue),
              });
            } else {
              console.log(err?.code);
              response.status(401).send({
                response: err?.message,
              });
            }
          },
        );
    });
  }

  @Post('/login')
  async login(
    @Req()
    request: Request<
      any,
      any,
      {
        email: string;
        username: string;
        password: string;
      }
    >,
    @Res() response: Response,
  ) {
    const { email, username, password } = request.body;

    this.person
      .getUser({ email, username })
      .then((res) => {
        const secretKey = process.env.SECRET;
        if (secretKey && res) {
          const [hashed, salt] = String(res.password).split('.');
          scrypt(password, salt, 82, (scryptError, derivedKey) => {
            const isValid = hashed === derivedKey.toString('hex');
            console.log(derivedKey.toString('hex'), res.password);
            if (isValid) {
              const token = sign(
                {
                  login: res.username,
                  user_id: res._id,
                },
                secretKey,
                {
                  expiresIn: 864e5,
                },
              );
              response.cookie('token', token, {
                expires: this.expiresAge(),
              });
              response.status(200).send({
                response: true,
              });
            } else {
              response.status(400).send({
                response: false,
              });
            }
          });
        } else {
          response.status(400).send({
            response: false,
          });
        }
      })
      .catch(
        (err: {
          message: any;
          code: keyof typeof MONGOOSE_ERRORS;
          keyValue: Record<string, string>;
        }) => {
          const errCode = err.code;
          if (errCode in MONGOOSE_ERRORS && MONGOOSE_ERRORS[errCode]) {
            response.status(401).send({
              response: MONGOOSE_ERRORS[errCode](err?.keyValue),
            });
          } else {
            console.log(err?.code);
            response.status(401).send({
              response: err?.message,
            });
          }
        },
      );
  }
  @Get('/me')
  async me(
    @Req()
    request: Request<any, any>,
    @Res() response: Response,
  ) {
    const me = useMe(request);
    this.person
      .getUser({ username: me.login })
      .then((res) => {
        if (!res) {
          return response.status(401).send({
            response: false,
          });
        }
        // const { _id, ...user } = res;
        response.status(200).send({
          response: res,
        });
      })
      .catch(
        (err: {
          message: any;
          code: keyof typeof MONGOOSE_ERRORS;
          keyValue: Record<string, string>;
        }) => {
          const errCode = err.code;
          if (errCode in MONGOOSE_ERRORS && MONGOOSE_ERRORS[errCode]) {
            response.status(401).send({
              response: MONGOOSE_ERRORS[errCode](err?.keyValue),
            });
          } else {
            console.log(err?.code);
            response.status(401).send({
              response: err?.message,
            });
          }
        },
      );
  }
}
