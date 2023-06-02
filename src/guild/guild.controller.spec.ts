import { Test } from '@nestjs/testing';
import { GuildController } from './guild.controller';
import type { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { Channels, ChannelsSchema } from '@/channels/channels.schema';
import {
  UsersGuilds,
  UsersGuildsSchema,
} from '@/users_guilds/users_guilds.schema';
import { Guild, GuildSchema } from './guild.schema';
import { GuildModule } from './guild.module';

describe('GuildController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
          useUnifiedTopology: true,
          autoIndex: true,
          dbName: 'discord',
        }),
        GuildModule,
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('should send POST request with request body', async () => {
    const response = await request(app.getHttpServer())
      .get('/guild')
      // .send({ key: 'value' }) // request body
      .expect(200);
    expect(response.body).toEqual({ response: true });
  });
  afterAll(async () => {
    await app.close();
  });
});
