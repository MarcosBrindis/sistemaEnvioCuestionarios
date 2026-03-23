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
exports.CreateUsuarioInternoController = void 0;
class CreateUsuarioInternoController {
    constructor(createUsuarioInterno) {
        this.createUsuarioInterno = createUsuarioInterno;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, email, password, id_rol } = req.body;
                if (!nombre || !email || !password || !id_rol) {
                    res.status(400).json({
                        success: false,
                        error: 'Faltan campos requeridos: nombre, email, password, id_rol',
                    });
                    return;
                }
                const result = yield this.createUsuarioInterno.execute({
                    nombre,
                    email,
                    password,
                    id_rol,
                });
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.status(201).json({
                    success: true,
                    data: result.data,
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
exports.CreateUsuarioInternoController = CreateUsuarioInternoController;
