import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
@Controller('')
export default class AppController {
  getResizeOption(dimensions: {
    width: number | undefined;
    height: number | undefined;
    maxWidth: number; // 550,
    maxHeight: number; // 550,
  }) {
    const { height, maxHeight, maxWidth, width } = dimensions;
    const resizeOptions: {
      width: number | undefined;
      height: number | undefined;
    } = {
      width: undefined,
      height: undefined,
    };

    // CHECK IF WE HAVE DIMENSIONS
    if (height && width) {
      // RESIZE BY HEIGHT
      if (height > width) {
        resizeOptions.height = height > maxHeight ? maxHeight : height;
      }
      // RESIZE BY WIDTH
      else {
        resizeOptions.width = width > maxWidth ? maxWidth : width;
      }
    } else {
      resizeOptions.width = maxHeight;
    }
    return resizeOptions;
  }
  expiresAge = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };
  @Get('set-cookie')
  async setCookies(@Res() response: Response) {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImtzaXhlbiIsInVzZXJfaWQiOiI2NDc1ZmM0YmMxOTFjZjE3NTM4NzA4MjQiLCJpYXQiOjE2ODU0NTM4OTksImV4cCI6MTc3MTg1Mzg5OX0.TUSQwElDMZdtLGmx5JVOHzVZiJLKN1aiu2yiU2DLdwM';
    response.cookie('token', token, {
      expires: this.expiresAge(),
    });
  }

  @Get('file/:folder/:id')
  async getAvatarWithQuery(
    @Res() response: Response,
    @Req() request: Request,
    @Query('maxSize') maxSize = '',
  ) {
    // If Request Without `maxSize` then we use fs.createReadStream;
    if (!maxSize.length) {
      const imagePath = path.join(
        './static/',
        request.originalUrl.replace('file/', ''),
      );

      // Checking If file exists
      if (!fs.existsSync(imagePath)) {
        return response.sendStatus(404);
      }

      // HEADER TO MAKE AUTOMATICALLY DOWNLOAD
      // response.setHeader('Content-Disposition', `attachment; filename="${id}"`);

      response.setHeader('Content-Type', 'image/jpeg');

      return fs.createReadStream(imagePath).pipe(response);
    }
    // Or if it's image needed resize then we use `sharp`
    const [filePath] = request.originalUrl.replace('/file', '').split('?');
    const imagePath = path.join('./static/', filePath);

    // Checking If file exists
    if (!fs.existsSync(imagePath)) {
      return response.sendStatus(404);
    }
    const [maxWidth, maxHeight] = maxSize.split('x');
    const sharpedFile = sharp(imagePath);
    const dimensions = await sharpedFile.metadata();
    const resizeOptions = this.getResizeOption({
      height: dimensions.height,
      width: dimensions.width,
      maxWidth: Number(maxWidth),
      maxHeight: Number(maxHeight),
    });

    // HEADER TO MAKE AUTOMATICALLY DOWNLOAD
    // response.setHeader('Content-Disposition', `attachment; filename="${id}"`);

    response.setHeader('Content-Type', 'image/jpeg');
    const buffer = await sharpedFile
      .resize({
        ...resizeOptions,
        fit: sharp.fit.contain,
      })
      .webp({ effort: 3 })
      .toBuffer();
    response.status(200).send(buffer);
  }
}
