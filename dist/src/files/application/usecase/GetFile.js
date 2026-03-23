"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class GetFile {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullFilePath = this.findFilePathById(id);
            if (!fullFilePath) {
                throw new Error('Archivo no encontrado');
            }
            const fileBuffer = fs_1.default.readFileSync(fullFilePath);
            const extension = path_1.default.extname(fullFilePath).toLowerCase();
            return {
                file: fileBuffer,
                mimeType: this.getMimeTypeByExtension(extension),
                originalName: path_1.default.basename(fullFilePath),
            };
        });
    }
    getMetadata(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullFilePath = this.findFilePathById(id);
            if (!fullFilePath) {
                throw new Error('Archivo no encontrado');
            }
            const stats = fs_1.default.statSync(fullFilePath);
            const extension = path_1.default.extname(fullFilePath).toLowerCase();
            const uploadedBy = this.extractUploadedBy(fullFilePath);
            const relativePath = path_1.default.relative(process.cwd(), fullFilePath);
            return {
                id,
                original_name: path_1.default.basename(fullFilePath),
                file_path: relativePath,
                mime_type: this.getMimeTypeByExtension(extension),
                size: stats.size,
                uploaded_at: stats.mtime,
                uploaded_by: uploadedBy,
            };
        });
    }
    getFilesByUser(egresadoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseDir = path_1.default.join(process.cwd(), 'uploads', 'users', String(egresadoId));
            if (!fs_1.default.existsSync(baseDir)) {
                return [];
            }
            const files = this.listFilesRecursively(baseDir);
            return files.map((fullPath) => {
                const stats = fs_1.default.statSync(fullPath);
                const extension = path_1.default.extname(fullPath).toLowerCase();
                const id = path_1.default.basename(fullPath, extension);
                return {
                    id,
                    original_name: path_1.default.basename(fullPath),
                    file_path: path_1.default.relative(process.cwd(), fullPath),
                    mime_type: this.getMimeTypeByExtension(extension),
                    size: stats.size,
                    uploaded_at: stats.mtime,
                    uploaded_by: egresadoId,
                };
            });
        });
    }
    findFilePathById(id) {
        const baseDir = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(baseDir)) {
            return null;
        }
        const files = this.listFilesRecursively(baseDir);
        for (const filePath of files) {
            const extension = path_1.default.extname(filePath);
            const filename = path_1.default.basename(filePath, extension);
            if (filename === id) {
                return filePath;
            }
        }
        return null;
    }
    listFilesRecursively(dirPath) {
        const entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
        const files = [];
        for (const entry of entries) {
            const fullPath = path_1.default.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                files.push(...this.listFilesRecursively(fullPath));
            }
            else if (entry.isFile()) {
                files.push(fullPath);
            }
        }
        return files;
    }
    getMimeTypeByExtension(extension) {
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
    extractUploadedBy(fullFilePath) {
        const parts = fullFilePath.split(path_1.default.sep);
        const usersIndex = parts.indexOf('users');
        if (usersIndex !== -1 && parts[usersIndex + 1]) {
            const parsed = Number(parts[usersIndex + 1]);
            return Number.isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
    }
}
exports.GetFile = GetFile;
