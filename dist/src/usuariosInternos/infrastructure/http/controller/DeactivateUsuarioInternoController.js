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
exports.DeactivateUsuarioInternoController = void 0;
class DeactivateUsuarioInternoController {
    constructor(deactivateUsuarioInterno) {
        this.deactivateUsuarioInterno = deactivateUsuarioInterno;
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
                const result = yield this.deactivateUsuarioInterno.execute(id_usuario);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.json({
                    success: true,
                    message: 'Usuario desactivado correctamente',
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
exports.DeactivateUsuarioInternoController = DeactivateUsuarioInternoController;
