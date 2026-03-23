"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbEnv = void 0;
exports.validateDBEnv = validateDBEnv;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbEnv = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT) || 3306,
};
function validateDBEnv() {
    const required = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
    }
}
