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
exports.ResetPasswordController = void 0;
class ResetPasswordController {
    constructor(resetPassword) {
        this.resetPassword = resetPassword;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const id_usuario = parseInt(id);
                if (isNaN(id_usuario)) {
                    res.status(400).json({
                        success: false,
                        error: 'ID de usuario inválido',
                    });
                    return;
                }
                const { new_password } = req.body;
                if (!new_password) {
                    res.status(400).json({
                        success: false,
                        error: 'Campo requerido: new_password',
                    });
                    return;
                }
                const result = yield this.resetPassword.execute(id_usuario, new_password);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.json({
                    success: true,
                    message: 'Contraseña restablecida correctamente',
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
}
exports.ResetPasswordController = ResetPasswordController;
