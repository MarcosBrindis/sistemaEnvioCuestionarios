"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueFilename = exports.generateStoragePath = exports.multerConfig = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
exports.multerConfig = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
        }
        else {
            callback(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
        }
    },
});
const generateStoragePath = (uploadedBy) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    if (uploadedBy) {
        return path_1.default.join('uploads', 'users', String(uploadedBy), String(year), month);
    }
    return path_1.default.join('uploads', 'public', String(year), month);
};
exports.generateStoragePath = generateStoragePath;
const generateUniqueFilename = (originalName) => {
    const uuid = (0, uuid_1.v4)();
    const fileExtension = path_1.default.extname(originalName);
    const filename = `${uuid}${fileExtension}`;
    return { uuid, filename };
};
exports.generateUniqueFilename = generateUniqueFilename;
