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
exports.ActivateClientUseCase = void 0;
const RotateKeyUseCase_1 = require("./RotateKeyUseCase");
class ActivateClientUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.repo.findById(id_client);
            if (!client)
                throw new RotateKeyUseCase_1.ClientNotFoundError(id_client);
            if (client.is_active)
                throw new Error('El cliente ya está activo');
            yield this.repo.activate(id_client);
            return Object.assign(Object.assign({}, client), { is_active: true });
        });
    }
}
exports.ActivateClientUseCase = ActivateClientUseCase;
