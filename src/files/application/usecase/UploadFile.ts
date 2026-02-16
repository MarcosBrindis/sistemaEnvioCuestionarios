import fs from 'fs';
import path from 'path';
import { generateStoragePath, generateUniqueFilename } from '../../../config/multer';

export class UploadFile {
  async execute(
    fileBuffer: Buffer,
    originalName: string,
    _mimeType: string,
    _size: number,
    uploadedBy?: number
  ): Promise<string> {
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
      return uuid;
    } catch (error) {
      if (fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
      }
      throw error;
    }
  }
}
