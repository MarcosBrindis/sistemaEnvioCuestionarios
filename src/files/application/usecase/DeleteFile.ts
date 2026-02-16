import fs from 'fs';
import path from 'path';

export class DeleteFile {
  async execute(id: string): Promise<void> {
    const fullFilePath = this.findFilePathById(id);

    if (!fullFilePath) {
      throw new Error('Archivo no encontrado');
    }

    if (fs.existsSync(fullFilePath)) {
      fs.unlinkSync(fullFilePath);
    }
  }

  private findFilePathById(id: string): string | null {
    const baseDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(baseDir)) {
      return null;
    }

    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    const queue: string[] = entries.map((entry) => path.join(baseDir, entry.name));

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        continue;
      }

      const stats = fs.statSync(current);
      if (stats.isDirectory()) {
        const innerEntries = fs.readdirSync(current, { withFileTypes: true });
        innerEntries.forEach((entry) => queue.push(path.join(current, entry.name)));
        continue;
      }

      const extension = path.extname(current);
      const filename = path.basename(current, extension);
      if (filename === id) {
        return current;
      }
    }

    return null;
  }
}
