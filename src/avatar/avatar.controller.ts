import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@Controller('avatar')
export class AvatarController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: unknown, @Res() response: Response) {
    response.status(201).send({
      response: file,
    });
  }
}
