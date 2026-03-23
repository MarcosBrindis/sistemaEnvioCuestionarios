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
exports.UploadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = require("../../../config/multer");
class UploadFile {
    execute(fileBuffer, originalName, _mimeType, _size, uploadedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uuid, filename } = (0, multer_1.generateUniqueFilename)(originalName);
            const storagePath = (0, multer_1.generateStoragePath)(uploadedBy);
            const fullStoragePath = path_1.default.join(process.cwd(), storagePath);
            if (!fs_1.default.existsSync(fullStoragePath)) {
                fs_1.default.mkdirSync(fullStoragePath, { recursive: true });
            }
            const filePath = path_1.default.join(storagePath, filename);
            const fullFilePath = path_1.default.join(process.cwd(), filePath);
            try {
                fs_1.default.writeFileSync(fullFilePath, fileBuffer);
                // Retornar la ruta relativa normalizada para usarla en la URL
                const relativePath = path_1.default.relative(process.cwd(), fullFilePath).replace(/\\/g, '/');
                return {
                    uuid,
                    relativePath
                };
            }
            catch (error) {
                if (fs_1.default.existsSync(fullFilePath)) {
                    fs_1.default.unlinkSync(fullFilePath);
                }
                throw error;
            }
        });
    }
}
exports.UploadFile = UploadFile;
