import { AttachmentType } from '@/controllers/messages/files.shema';
import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as sharp from 'sharp';

@Controller('files')
export class FilesController {
  buffer = Buffer.alloc(24);

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
