import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
               return callback(
                    null,
                    `${randomName}${extname(file.originalname)}`,
               );
          },
     }),
};
