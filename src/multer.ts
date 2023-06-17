import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination(req, file, callback) {
      if (req.originalUrl.includes('attachments')) {
        callback(null, './static/attachments/');
      } else {
        callback(null, './static/avatars/');
      }
    },
    filename: (req, file, callback) => {
      const randomName = uuidv4();
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
