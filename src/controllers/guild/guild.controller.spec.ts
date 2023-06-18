import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { GuildModule } from './guild.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { SocketStoreModule } from '@/socket/SocketStore.module';

describe('GuildController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    dotenv.config();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
          useUnifiedTopology: true,
          autoIndex: true,
          dbName: 'discord',
        }),
        GuildModule,
        SocketStoreModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('try to create guild', async () => {
    const guildResponse = await request(app.getHttpServer())
      .post('/guild/create')
      .set(
        'Cookie',
        process.env.DEV_TOKEN ? [`token=${process.env.DEV_TOKEN}`] : [],
      )
      .send({
        name: 'helloworld',
      })
      .expect(201);

    // await request(app.getHttpServer())
    //   .delete('/guild/remove')
    //   .set(
    //     'Cookie',
    //     process.env.DEV_TOKEN ? [`token=${process.env.DEV_TOKEN}`] : [],
    //   )
    //   .send({
    //     guild_id: guildResponse.body?.response?.id,
    //   })
    //   .expect(204);
  });
  it('try to get my guilds list', async () => {
    const response = await request(app.getHttpServer())
      .get('/guild/my')
      .set(
        'Cookie',
        process.env.DEV_TOKEN ? [`token=${process.env.DEV_TOKEN}`] : [],
      )
      .expect(200);
    expect(response.body).toEqual({
      response: expect.any(Array),
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
