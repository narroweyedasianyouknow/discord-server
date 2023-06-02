import { Inject, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { SocketStore } from './SocketStore';
import { PostgreSQL } from './postgres';
import type { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Guild } from './guild/guild.schema';
import { Model } from 'mongoose';
import { UsersGuilds } from './users_guilds/users_guilds.schema';

@Injectable()
export class SocketIoServer {
  private server: Server;
  constructor(
    @InjectModel(UsersGuilds.name) private usersGuildsModel: Model<UsersGuilds>,
    @Inject(SocketStore) private readonly socketStore: SocketStore,
  ) {}

  async findMyGuilds(user_id: string): Promise<string[]> {
    const list = await this.usersGuildsModel
      .findOne({
        user_id: user_id,
      })
      .lean()
      .exec();
    if (!list) return [];
    return list.chats;
  }
  configure(server: any): void {
    this.server = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    this.server.on('connection', (socket: Socket) => {
      if (process.env.SECRET && socket?.handshake?.auth?.token) {
        try {
          const decoded = verify(
            socket?.handshake?.auth?.token,
            process.env.SECRET,
          );

          if (typeof decoded !== 'string' && 'user_id' in decoded) {
            this.socketStore.addUserSocket(decoded.user_id, socket);
            this.findMyGuilds(decoded.user_id).then((result) => {
              socket.join(result);
            });
          }
        } catch (error) {
          socket.disconnect();
        }
      } else {
        socket.disconnect();
      }
      socket.on('disconnect', () => {
        console.log('socket disconnect:', socket.id);
        const userId = socket.handshake.query.userId as string;
        this.socketStore.removeUserSocket(userId);
      });
      socket.on('on join-room', (data) => {
        console.log('socket join room:', data);
      });
    });
  }

  getServer(): Server {
    return this.server;
  }
}
