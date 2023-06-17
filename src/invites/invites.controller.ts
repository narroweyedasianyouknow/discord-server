import { AttachmentType } from '@/messages/files.shema';
import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('invites')
export class FilesController {
  private generateRandomCode(length: number, guild_id: string, user: string) {
    // Characters to create "random" invite code
    const characters = `${guild_id}${user}ABCDEFGHIJKLMNOPQRSTUVWXYZ${guild_id}${user}abcdefghijklmnopqrstuvwxyz${guild_id}${user}0123456789${guild_id}${user}`;
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  @Post('avatar')
  async createInvite(
    @Req()
    request: Request,
    @Res() response: Response,
  ) {
    response.status(201).send({
      response: {},
    });
  }
}
