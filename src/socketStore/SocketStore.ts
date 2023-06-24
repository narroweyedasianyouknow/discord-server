import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';

@Injectable()
export class SocketStore {
      private readonly socketMap = new Map<string, Socket>();

      addUserSocket(userId: string, socket: Socket): void {
            this.socketMap.set(userId, socket);
      }

      getUserSocket(userId: string): Socket | undefined {
            return this.socketMap.get(userId);
      }

      removeUserSocket(userId: string): void {
            this.socketMap.delete(userId);
      }
}
