import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getRandomNumber(): number {
    return Math.floor(Math.random() * 10);
  }
}
