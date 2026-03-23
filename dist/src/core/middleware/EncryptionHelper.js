"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionHelper = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY || '';
const IV_LENGTH = 16; // AES block size
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    throw new Error('EMAIL_ENCRYPTION_KEY must be set in .env and be at least 32 characters (256 bits)');
}
class EncryptionHelper {
    static encrypt(text) {
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return iv.toString('base64') + ':' + encrypted;
    }
    static decrypt(encrypted) {
        const [ivBase64, encryptedText] = encrypted.split(':');
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
exports.EncryptionHelper = EncryptionHelper;
