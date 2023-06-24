import {
     Body,
     Controller,
     Get,
     HttpCode,
     HttpException,
     HttpStatus,
     Inject,
     Post,
     Res,
} from '@nestjs/common';
import { scryptSync, randomBytes } from 'crypto';
import type { Response } from 'express';
import { sign } from 'jsonwebtoken';

import { PersonService } from './person.service';

import { Profile } from '@/decorators/Profile';

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
          avatar: '', // the user's avatar hash identify
          bot: false, // whether the user belongs to an OAuth2 application identify
          system: false, // whether the user is an Official Discord System user (part of the urgent message system) identify
          mfa_enabled: false, // whether the user has two factor enabled on their account identify
          banner: '', // the user's banner hash identify
          accent_color: 0, // the user's banner color encoded as an integer representation of hexadecimal color code identify
          locale: '', // the user's chosen language option identify
          verified: false, // whether the email on this account has been verified email
          email: '', // the user's email email
     };

     @Post('/create')
     async signUp(
          @Body()
          body: {
               username: string;
               email: string;
               password: string;
               locale: string;
          },
          @Res() response: Response,
     ) {
          const { email, username, password, locale } = body;

          const secretKey = process.env.SECRET;
          if (!secretKey) {
               throw new HttpException(
                    'Error! Secret code is not settled',
                    HttpStatus.INTERNAL_SERVER_ERROR,
               );
          }
          // SALT
          const salt = randomBytes(8).toString('hex');

          const derivedKey = scryptSync(password, salt, 82);
          const hashedSaltPassword = `${derivedKey.toString('hex')}.${salt}`;

          // The following restrictions are additionally enforced for usernames:

          // Usernames cannot contain the following substrings: @, #, :, ```, discord
          // Usernames cannot be: everyone, here
          const user = {
               ...this.defaultUser,
               username: username, // the user's username, not unique across the platform identify
               email: email,
               locale: locale,
               accent_color: this.randomHex(),
          };

          const createdPerson = await this.person.create({
               ...user,
               password: hashedSaltPassword,
          });
          const token = sign(
               {
                    login: user.username,
                    user_id: createdPerson.id,
               },
               secretKey,
               {
                    expiresIn: 864e5,
               },
          );
          response
               .cookie('token', token, {
                    expires: this.expiresAge(),
               })
               .status(201)
               .send({
                    response: user,
               });
     }

     @Post('/login')
     async login(
          @Body()
          body: {
               email: string;
               username: string;
               password: string;
          },
          @Res() response: Response,
     ) {
          const { email, username, password } = body;

          const secretKey = process.env.SECRET;
          if (!secretKey) {
               throw new HttpException(
                    'Error! Secret code is not settled',
                    HttpStatus.INTERNAL_SERVER_ERROR,
               );
          }

          const getUser = await this.person.getAuthUser({ email, username });
          const authError = new HttpException(
               `Error! Login/email or password doesn't correct`,
               HttpStatus.BAD_REQUEST,
          );

          // If user doesn't exists in DB
          if (!getUser) throw authError;

          const { password: settledPassword, ...user } = getUser;
          const [hashed, salt] = String(settledPassword).split('.');
          const derivedKey = scryptSync(password, salt, 82);
          const isValid = hashed === derivedKey.toString('hex');
          if (!isValid) throw authError;

          const token = sign(
               {
                    login: user.username,
                    user_id: user.id,
               },
               secretKey,
               {
                    expiresIn: 864e5,
               },
          );
          response
               .status(200)
               .cookie('token', token, {
                    expires: this.expiresAge(),
               })
               .send({
                    response: user,
               });
     }
     @Get('/me')
     @HttpCode(200)
     async me(@Profile() user: CookieProfile) {
          const profile = await this.person.getUser({ username: user.login });

          if (!profile) {
               throw new HttpException(
                    'Error! Cannot get user',
                    HttpStatus.BAD_REQUEST,
               );
          }

          return {
               response: profile,
          };
     }
}
