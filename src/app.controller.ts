import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('users_guilds')
export default class AppController {
  expiresAge = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };
  @Get('set-cookie')
  async setCookies(@Res() response: Response) {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImtzaXhlbiIsInVzZXJfaWQiOiI2NDc1ZmM0YmMxOTFjZjE3NTM4NzA4MjQiLCJpYXQiOjE2ODU0NTM4OTksImV4cCI6MTc3MTg1Mzg5OX0.TUSQwElDMZdtLGmx5JVOHzVZiJLKN1aiu2yiU2DLdwM';
    response.cookie('token', token, {
      expires: this.expiresAge(),
    });
  }
}
