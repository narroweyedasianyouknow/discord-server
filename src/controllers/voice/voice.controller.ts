import { Body, Controller, Post } from '@nestjs/common';

import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
      constructor(private readonly chatService: VoiceService) {}

      @Post('call')
      async callPeer(
            @Body() body: { peerId: string; stream: MediaStream },
      ): Promise<void> {
            this.chatService.callPeer(body.peerId, body.stream);
      }
}
