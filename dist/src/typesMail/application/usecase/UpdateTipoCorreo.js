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
exports.UpdateTipoCorreo = void 0;
class UpdateTipoCorreo {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id, tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tipo || !tipo.trim()) {
                throw new Error('El campo tipo es obligatorio');
            }
            if (yield this.repo.existsByTipo(tipo)) {
                throw new Error('El tipo de correo ya existe');
            }
            return this.repo.update(id, tipo.trim());
        });
    }
}
exports.UpdateTipoCorreo = UpdateTipoCorreo;
