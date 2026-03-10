import fs from 'fs';
import path from 'path';
import { generateStoragePath, generateUniqueFilename } from '../../../config/multer';

export interface UploadFileResult {
  uuid: string;
  relativePath: string;
}

export class UploadFile {
  async execute(
    fileBuffer: Buffer,
    originalName: string,
    _mimeType: string,
    _size: number,
    uploadedBy?: number
  ): Promise<UploadFileResult> {
    const { uuid, filename } = generateUniqueFilename(originalName);

    const storagePath = generateStoragePath(uploadedBy);
    const fullStoragePath = path.join(process.cwd(), storagePath);

    if (!fs.existsSync(fullStoragePath)) {
      fs.mkdirSync(fullStoragePath, { recursive: true });
    }

    const filePath = path.join(storagePath, filename);
    const fullFilePath = path.join(process.cwd(), filePath);

    try {
      fs.writeFileSync(fullFilePath, fileBuffer);
      // Retornar la ruta relativa normalizada para usarla en la URL
      const relativePath = path.relative(process.cwd(), fullFilePath).replace(/\\/g, '/');
      
      return {
        uuid,
        relativePath
      };
    } catch (error) {
      if (fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
      }
      throw error;
    }
  }
}
