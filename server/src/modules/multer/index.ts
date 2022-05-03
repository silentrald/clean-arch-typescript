import { RequestHandler } from 'express';
import multer from 'multer';

export const createUploadSingle = (
  field: string,
  storage: multer.DiskStorageOptions,
  options?: multer.Options
): RequestHandler => {
  const upload = multer({
    storage: multer.diskStorage(storage),
    ...options,
  });
  return upload.single(field);
};
