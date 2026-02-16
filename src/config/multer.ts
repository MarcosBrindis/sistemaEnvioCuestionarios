import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximo
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
    }
  },
});

export const generateStoragePath = (uploadedBy?: number): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  if (uploadedBy) {
    return path.join('uploads', 'users', String(uploadedBy), String(year), month);
  }
  return path.join('uploads', 'public', String(year), month);
};

export const generateUniqueFilename = (originalName: string): { uuid: string; filename: string } => {
  const uuid = uuidv4();
  const fileExtension = path.extname(originalName);
  const filename = `${uuid}${fileExtension}`;
  return { uuid, filename };
};
