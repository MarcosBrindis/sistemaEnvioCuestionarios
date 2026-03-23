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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiClientRepository = void 0;
class BaseApiClientRepository {
    save(_client_name, _api_key_hash, _prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    updateCredentials(_id_client, _api_key_hash, _prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    findByName(_client_name) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    findById(_id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    findByPrefix(_prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    revoke(_id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    activate(_id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
}
exports.BaseApiClientRepository = BaseApiClientRepository;
