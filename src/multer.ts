import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const multerOptions = {
  storage: diskStorage({
    destination: './static/uploads',
    filename: (req, file, callback) => {
      const randomName = uuidv4();
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
