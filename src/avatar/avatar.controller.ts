import GoogleCloudClient from '@/vision';
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
@Controller('avatar')
export class AvatarController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile()
    file: FileType,
    @Res() response: Response,
  ) {
    const {
      fieldname,
      destination,
      path,
      encoding,
      originalname,
      ...uploaded
    } = file;
    response.status(201).send({
      response: uploaded,
    });
  }
  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFilesList(
    @UploadedFiles()
    files: FileType[],
    @Res() response: Response,
  ) {
    console.log(files[0].path);
    // const [result] = await GoogleCloudClient.safeSearchDetection(files[0].path);
    // console.log(result);
    response.status(201).send({
      response: files.map(
        ({
          fieldname,
          destination,
          path,
          encoding,
          originalname,
          ...uploaded
        }) => ({ ...uploaded }),
      ),
    });
  }
}
