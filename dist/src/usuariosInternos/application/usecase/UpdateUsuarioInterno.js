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
exports.UpdateUsuarioInterno = void 0;
class UpdateUsuarioInterno {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id_usuario, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.repository.updateUser(id_usuario, input);
                if (!updated) {
                    return {
                        success: false,
                        error: 'No se pudo actualizar el usuario',
                    };
                }
                const usuario = yield this.repository.getUserById(id_usuario);
                if (!usuario) {
                    return {
                        success: false,
                        error: 'Usuario no encontrado después de actualizar',
                    };
                }
                return {
                    success: true,
                    data: usuario,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                };
            }
        });
    }
}
exports.UpdateUsuarioInterno = UpdateUsuarioInterno;
