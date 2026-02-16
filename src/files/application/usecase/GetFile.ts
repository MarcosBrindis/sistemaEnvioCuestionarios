import fs from 'fs';
import path from 'path';

export class GetFile {
  async execute(id: string): Promise<{ file: Buffer; mimeType: string; originalName: string }> {
    const fullFilePath = this.findFilePathById(id);

    if (!fullFilePath) {
      throw new Error('Archivo no encontrado');
    }

    const fileBuffer = fs.readFileSync(fullFilePath);
    const extension = path.extname(fullFilePath).toLowerCase();

    return {
      file: fileBuffer,
      mimeType: this.getMimeTypeByExtension(extension),
      originalName: path.basename(fullFilePath),
    };
  }

  async getMetadata(id: string): Promise<{
    id: string;
    original_name: string;
    file_path: string;
    mime_type: string;
    size: number;
    uploaded_at: Date;
    uploaded_by?: number;
  }> {
    const fullFilePath = this.findFilePathById(id);

    if (!fullFilePath) {
      throw new Error('Archivo no encontrado');
    }

    const stats = fs.statSync(fullFilePath);
    const extension = path.extname(fullFilePath).toLowerCase();
    const uploadedBy = this.extractUploadedBy(fullFilePath);
    const relativePath = path.relative(process.cwd(), fullFilePath);

    return {
      id,
      original_name: path.basename(fullFilePath),
      file_path: relativePath,
      mime_type: this.getMimeTypeByExtension(extension),
      size: stats.size,
      uploaded_at: stats.mtime,
      uploaded_by: uploadedBy,
    };
  }

  async getFilesByUser(egresadoId: number): Promise<Array<{
    id: string;
    original_name: string;
    file_path: string;
    mime_type: string;
    size: number;
    uploaded_at: Date;
    uploaded_by?: number;
  }>> {
    const baseDir = path.join(process.cwd(), 'uploads', 'users', String(egresadoId));
    if (!fs.existsSync(baseDir)) {
      return [];
    }

    const files = this.listFilesRecursively(baseDir);

    return files.map((fullPath) => {
      const stats = fs.statSync(fullPath);
      const extension = path.extname(fullPath).toLowerCase();
      const id = path.basename(fullPath, extension);

      return {
        id,
        original_name: path.basename(fullPath),
        file_path: path.relative(process.cwd(), fullPath),
        mime_type: this.getMimeTypeByExtension(extension),
        size: stats.size,
        uploaded_at: stats.mtime,
        uploaded_by: egresadoId,
      };
    });
  }

  private findFilePathById(id: string): string | null {
    const baseDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(baseDir)) {
      return null;
    }

    const files = this.listFilesRecursively(baseDir);
    for (const filePath of files) {
      const extension = path.extname(filePath);
      const filename = path.basename(filePath, extension);
      if (filename === id) {
        return filePath;
      }
    }

    return null;
  }

  private listFilesRecursively(dirPath: string): string[] {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.listFilesRecursively(fullPath));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private getMimeTypeByExtension(extension: string): string {
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.webp':
        return 'image/webp';
      case '.pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }

  private extractUploadedBy(fullFilePath: string): number | undefined {
    const parts = fullFilePath.split(path.sep);
    const usersIndex = parts.indexOf('users');
    if (usersIndex !== -1 && parts[usersIndex + 1]) {
      const parsed = Number(parts[usersIndex + 1]);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }
}
