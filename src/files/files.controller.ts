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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import * as sharp from 'sharp';
import * as nodePath from 'path';
import { v4 as uuidv4 } from 'uuid';
import { closeSync, openSync, readSync, stat } from 'node:fs';

type FileType = {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
};
@Controller('files')
export class FilesController {
  buffer = Buffer.alloc(24);

  /** @deprecated Useless because I can use library `sharp` and get dimensions */
  private getImageDimensions(imagePath: string) {
    const fileDescriptor = openSync(imagePath, 'r');
    readSync(fileDescriptor, this.buffer, 0, 24, 0);
    closeSync(fileDescriptor);

    // Проверяем формат изображения
    const isJPEG = this.buffer.toString('hex', 0, 2) === 'ffd8';
    const isPNG = this.buffer.toString('hex', 0, 8) === '89504e470d0a1a0a';
    const isGIF =
      this.buffer.toString('hex', 0, 6) === '474946383961' ||
      this.buffer.toString('hex', 0, 6) === '474946383761';

    // Если изображение в формате JPEG или PNG, получаем высоту и ширину
    if (isJPEG) {
      const heightOffset = this.buffer.indexOf(Buffer.from([0xff, 0xc0])) + 5;
      const widthOffset = heightOffset + 2;

      const height = this.buffer.readUInt16BE(heightOffset);
      const width = this.buffer.readUInt16BE(widthOffset);

      return {
        height,
        width,
      };
    } else if (isPNG) {
      const width = this.buffer.readUInt32BE(16);
      const height = this.buffer.readUInt32BE(20);

      return {
        height,
        width,
      };
    } else if (isGIF) {
      const width = this.buffer.readUInt16LE(6);
      const height = this.buffer.readUInt16LE(8);

      return {
        height,
        width,
      };
    } else {
      return {};
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Res() response: Response,
  ) {
    const { path, mimetype, filename } = file;

    const dimensions = await sharp(path).metadata();

    const attach: AttachmentType = {
      filename: filename,
      size: dimensions.size ?? 0,
      height: dimensions.height ?? 0,
      width: dimensions.width ?? 0,
      content_type: mimetype,
      description: '',
      duration_secs: undefined,
      ephemeral: false,
      waveform: undefined,
    };
    response.status(201).send({
      response: attach,
    });
  }
  @Post('attachments')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFilesList(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Res() response: Response,
  ) {
    // TODO GOOGLE VISION
    // const [result] = await GoogleCloudClient.safeSearchDetection(files[0].path);
    // console.log(result);
    response.status(201).send({
      response: await Promise.all(
        files.map(async ({ path, mimetype, filename }) => {
          const dimensions = await sharp(path).metadata();

          const attach: AttachmentType = {
            filename: filename,
            size: dimensions.size ?? 0,
            height: dimensions.height ?? 0,
            width: dimensions.width ?? 0,
            content_type: mimetype,
            description: '',
            duration_secs: undefined,
            ephemeral: false,
            waveform: undefined,
          };
          // TODO VIDEO DURATION & DIMENSIONS
          // const command = `ffprobe -v error -show_entries format=duration:stream=width,height -of json ${path}`;
          // exec(command, (err, stdout, stderr) => {
          //   const metadata = JSON.parse(stdout);

          //   const duration = metadata.format.duration;
          //   const width = metadata.streams[0].width;
          //   const height = metadata.streams[0].height;

          //   console.log('Длительность (в секундах):', duration);
          //   console.log('Высота:', height);
          //   console.log('Ширина:', width);
          // });

          return attach;
        }),
      ),
    });
  }
}
