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
exports.RegisterClientUseCase = exports.ClientNameAlreadyExistsError = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
class ClientNameAlreadyExistsError extends Error {
    constructor(name) {
        super(`El nombre del cliente '${name}' ya existe.`);
        this.name = 'ClientNameAlreadyExistsError';
    }
}
exports.ClientNameAlreadyExistsError = ClientNameAlreadyExistsError;
class RegisterClientUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    execute(client_name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!client_name || client_name.trim() === '') {
                throw new Error('El nombre del cliente no puede estar vacío.');
            }
            // Generar API Key segura
            const apiKey = 'sk_live_' + crypto_1.default.randomBytes(24).toString('hex');
            const prefix = apiKey.substring(0, 7);
            const api_key_hash = yield bcrypt_1.default.hash(apiKey, 10);
            try {
                const client = yield this.repo.save(client_name, api_key_hash, prefix);
                return { apiKey, client };
            }
            catch (err) {
                if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                    throw new ClientNameAlreadyExistsError(client_name);
                }
                throw err;
            }
        });
    }
}
exports.RegisterClientUseCase = RegisterClientUseCase;
