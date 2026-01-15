import multer from 'multer';
import { Request } from 'express';

// memory storage
const storage = multer.memoryStorage();

//images only
const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter: imageFilter,
});

// Middleware exports
export const uploadSingle = (fieldName: string) => upload.single(fieldName);


export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);


export const uploadFields = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields);

export default upload;
