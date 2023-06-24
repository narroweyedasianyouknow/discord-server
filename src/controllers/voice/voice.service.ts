import { Injectable } from '@nestjs/common';
import { MediaConnection, Peer } from 'peerjs';

@Injectable()
export class VoiceService {
      private peer: Peer;
      private conn: MediaConnection;

      constructor() {
            this.peer = new Peer('your-own-id', {
                  host: 'localhost',
                  port: 9000,
                  path: '/peerjs', // Use the correct path to match your PeerJS server setup
                  debug: 3,
            });

            this.peer.on('open', (id: string) => {
                  console.log('My peer ID is: ' + id);
            });

            this.peer.on('call', (call: MediaConnection) => {
                  this.conn = call;
                  this.conn.answer();

                  this.conn.on('stream', (stream: MediaStream) => {
                        console.log('Received stream');
                        // Play the stream
                        // For example, you can add an audio/video element to your page and pass it the stream
                  });
            });
      }

      callPeer(peerId: string, stream: MediaStream): void {
            const call = this.peer.call(peerId, stream);

            call.on('stream', (stream: MediaStream) => {
                  console.log('Received stream');
                  // Play the stream
                  // For example, you can add an audio/video element to your page and pass it the stream
            });
      }
}
