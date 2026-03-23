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
exports.ResetPasswordUsuarioInterno = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class ResetPasswordUsuarioInterno {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id_usuario, new_password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validatePassword(new_password);
                const password_hash = yield bcrypt_1.default.hash(new_password, 10);
                const updated = yield this.repository.changePassword(id_usuario, password_hash);
                if (!updated) {
                    return {
                        success: false,
                        error: 'No se pudo cambiar la contraseña',
                    };
                }
                return {
                    success: true,
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
exports.ResetPasswordUsuarioInterno = ResetPasswordUsuarioInterno;
