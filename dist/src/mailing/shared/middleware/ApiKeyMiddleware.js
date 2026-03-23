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
exports.ApiKeyMiddleware = ApiKeyMiddleware;
const MysqlApiClientRepository_1 = require("../../client/infrastructure/database/mysql/MysqlApiClientRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiClientRepo = new MysqlApiClientRepository_1.MysqlApiClientRepository();
function ApiKeyMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = req.header('x-api-key');
        if (!apiKey) {
            return res.status(401).json({ error: 'API Key requerida.' });
        }
        const prefix = apiKey.substring(0, 7);
        const candidates = yield apiClientRepo.findByPrefix(prefix);
        if (!candidates || candidates.length === 0) {
            return res.status(401).json({ error: 'API Key inválida.' });
        }
        for (const client of candidates) {
            if (yield bcrypt_1.default.compare(apiKey, client.api_key_hash)) {
                req.clientId = client.id_client;
                return next();
            }
        }
        return res.status(403).json({ error: 'API Key no autorizada.' });
    });
}
