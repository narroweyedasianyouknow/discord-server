import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: './static/uploads',
    filename: (req, file, callback) => {
      const randomName = uuidv4();
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
