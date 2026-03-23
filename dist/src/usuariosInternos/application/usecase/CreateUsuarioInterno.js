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
exports.CreateUsuarioInterno = void 0;
class CreateUsuarioInterno {
    constructor(repository) {
        this.repository = repository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validatePassword(input.password);
                const { id_usuario } = yield this.repository.createUser(input);
                const user = yield this.repository.getUserById(id_usuario);
                if (!user) {
                    return {
                        success: false,
                        error: 'No se pudo recuperar el usuario creado',
                    };
                }
                return {
                    success: true,
                    data: user,
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
    validatePassword(password) {
        if (password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('La contraseña debe contener al menos una mayúscula');
        }
        if (!/[0-9]/.test(password)) {
            throw new Error('La contraseña debe contener al menos un número');
        }
    }
}
exports.CreateUsuarioInterno = CreateUsuarioInterno;
