import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { useMe } from 'src/funcs/useMe';
import { postgres } from 'src/postgres';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger = console.log;

  @SubscribeMessage('emit-message')
  handleMessage(client: any, payload: any) {
    try {
      const decoded = verify(
        client?.handshake?.auth?.token,
        `${process.env.SECRET}`,
      ) as Record<string, any>;
      // console.log(payload);
      this.server.emit('on-messages', { ...payload, user: decoded?.login });
    } catch (error) {
      client.disconnect();
    }
  }

  // @SubscribeMessage('emit-user')
  // handleMessage(client: any, payload: any) {
  //   this.server.emit('message', payload);
  // }
  afterInit(server: Server) {
    this.logger('Init');
  }
  handleDisconnect(client: { id: any }) {
    // this.logger(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: any, ...args: any[]) {
    // const pg = await postgres();
    if (process.env.SECRET && client?.handshake?.auth?.token) {
      try {
        const decoded = verify(
          client?.handshake?.auth?.token,
          process.env.SECRET,
        );
        decoded;
      } catch (error) {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
    // this.logger(`Client connected:`, client?.handshake?.auth?.token);
  }
}
