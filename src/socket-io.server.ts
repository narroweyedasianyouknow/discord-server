import { Inject, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PostgreSQL } from './postgres';
import { verify } from 'jsonwebtoken';

@Injectable()
export class SocketIoServer {
  private server: Server;
  constructor(@Inject(PostgreSQL) private db: PostgreSQL) {}
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
            this.db
              .select<{
                user_id: string;
                chats: string[];
              }>({
                table: 'users_chats',
                condition: `WHERE user_id = '${decoded.login}'`,
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
      });
    });
  }

  getServer(): Server {
    return this.server;
  }
}
