import { Inject, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { SocketStore } from './SocketStore';
import type { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channels } from './channels/channels.schema';
import { UsersGuilds } from './users_guilds/users_guilds.schema';
import { CHANNEL_TYPES_LIST } from './channels/channels';

@Injectable()
export class SocketIoServer {
  private server: Server;
  constructor(
    @Inject(SocketStore) private readonly socketStore: SocketStore,
    @InjectModel(Channels.name) private channelsModel: Model<Channels>,
    @InjectModel(UsersGuilds.name) private usersGuildsModel: Model<UsersGuilds>,
  ) {}

  async findMyGuilds(user_id: string): Promise<string[]> {
    const list =
      (await this.usersGuildsModel
        .find({
          user_id: user_id,
        })
        .lean()
        .exec()) ?? [];

    const channels = await Promise.all(
      list.map(async (v) => {
        const search = await this.channelsModel.find(
          {
            guild_id: v.guild_id,
            channel_type: CHANNEL_TYPES_LIST.GUILD_TEXT,
          },
          {
            id: 1,
          },
        );
        return search.map((v) => v.id) as string[];
      }),
    );
    return channels.flatMap((v) => v);
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
