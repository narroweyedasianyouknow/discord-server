import { Inject, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { SocketStore } from './SocketStore';
import type { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersChannels } from './users_channels/users_channels.schema';

@Injectable()
export class SocketIoServer {
  private server: Server;
  constructor(
    @InjectModel(UsersChannels.name)
    private usersChannelsModel: Model<UsersChannels>,
    @Inject(SocketStore) private readonly socketStore: SocketStore,
  ) {}

  async findMyChannels(user_id: string): Promise<string[]> {
    const list = await this.usersChannelsModel
      .find({
        user_id: user_id,
      })
      .lean()
      .exec();
    if (!list) return [];
    return list.map((v) => v.channel_id);
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
            this.findMyChannels(decoded.user_id).then((result) => {
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
