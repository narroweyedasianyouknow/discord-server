import { Inject, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PostgreSQL } from './postgres';
import { verify } from 'jsonwebtoken';
import { SocketStore } from './SocketStore';

@Injectable()
export class SocketIoServer {
  private server: Server;
  constructor(
    @Inject(PostgreSQL) private db: PostgreSQL,
    @Inject(SocketStore) private readonly socketStore: SocketStore,
  ) {}
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

          if (typeof decoded !== 'string' && 'login' in decoded) {
            this.socketStore.addUserSocket(decoded.login, socket);
            this.db
              .select<{
                id: string;
                chats: string[];
              }>({
                table: 'person',
                condition: `WHERE login = '${decoded.login}'`,
              })
              .then((result) => {
                socket.join(result.rows[0].chats);
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
