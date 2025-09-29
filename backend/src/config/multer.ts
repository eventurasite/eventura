import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const uploadPath = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  storage: multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, callback) => {
      const hash = crypto.randomBytes(6).toString('hex');
      const fileName = `${hash}-${file.originalname}`;
      callback(null, fileName);
    },
  }),
};