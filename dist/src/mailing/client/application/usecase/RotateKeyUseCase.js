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
exports.RotateKeyUseCase = exports.ClientNotFoundError = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
class ClientNotFoundError extends Error {
    constructor(id) {
        super(`Cliente con id ${id} no encontrado.`);
        this.name = 'ClientNotFoundError';
    }
}
exports.ClientNotFoundError = ClientNotFoundError;
class RotateKeyUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.repo.findById(id_client);
            if (!client)
                throw new ClientNotFoundError(id_client);
            if (!client.is_active)
                throw new Error('No se puede rotar la clave de un cliente inactivo.');
            const newApiKey = 'sk_live_' + crypto_1.default.randomBytes(24).toString('hex');
            const newPrefix = newApiKey.substring(0, 7);
            const newHash = yield bcrypt_1.default.hash(newApiKey, 10);
            yield this.repo.updateCredentials(id_client, newHash, newPrefix);
            return { newApiKey, client_name: client.client_name, id_client };
        });
    }
}
exports.RotateKeyUseCase = RotateKeyUseCase;
