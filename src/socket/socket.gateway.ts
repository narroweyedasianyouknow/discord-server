import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
      WebSocketGateway,
      WebSocketServer,
      OnGatewayConnection,
      OnGatewayDisconnect,
      SubscribeMessage,
} from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { CHANNEL_TYPES_LIST } from '@/controllers/channels/channels';
import { Channels } from '@/controllers/channels/channels.schema';
import { UsersGuilds } from '@/controllers/users_guilds/users_guilds.schema';
import { SocketStore } from '@/socketStore/SocketStore';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
      constructor(
            @Inject(SocketStore) private readonly socketStore: SocketStore,
            @InjectModel(Channels.name)
            private channelsModel: Model<Channels>,
            @InjectModel(UsersGuilds.name)
            private usersGuildsModel: Model<UsersGuilds>,
      ) {}
      @WebSocketServer()
      server: Server;

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

      handleConnection(client: Socket) {
            if (process.env.SECRET) {
                  const decoded = verify(
                        client?.handshake?.auth?.token,
                        process.env.SECRET,
                  );

                  if (typeof decoded !== 'string' && 'user_id' in decoded) {
                        this.socketStore.addUserSocket(decoded.user_id, client);
                        this.findMyGuilds(decoded.user_id).then((result) => {
                              client.join(result);
                        });
                  }
            }
      }

      handleDisconnect(client: Socket) {
            if (process.env.SECRET) {
                  const decoded = verify(
                        client?.handshake?.auth?.token,
                        process.env.SECRET,
                  );

                  if (typeof decoded !== 'string' && 'user_id' in decoded) {
                        this.socketStore.removeUserSocket(decoded.user_id);
                  }
            }
      }

      @SubscribeMessage('createOffer')
      handleOffer(client: Socket, payload: RTCSessionDescriptionInit) {
            // Обработка предложения (offer) от клиента
            console.log(payload);
            this.server.emit('offer', payload);
      }

      @SubscribeMessage('createAnswer')
      handleAnswer(client: Socket, payload: RTCSessionDescriptionInit) {
            // Обработка ответа (answer) от клиента
            this.server.emit('answer', payload);
      }

      @SubscribeMessage('addIceCandidate')
      handleIceCandidate(client: Socket, payload: RTCIceCandidateInit) {
            this.server.emit('iceCandidate', payload);
      }
}
