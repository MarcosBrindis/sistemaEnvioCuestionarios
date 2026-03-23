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
exports.loginController = void 0;
const dependencies_1 = require("../../dependencies");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        if (!data || data.type !== 'auth') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const attrs = data.attributes || {};
        if (!attrs.curp) {
            return res.status(400).json({ error: 'La curp es obligatoria' });
        }
        const loginResult = yield dependencies_1.loginEgresadoUsecase.execute(attrs.curp);
        if (!loginResult) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        req.session.user = loginResult.user;
        res.status(200).json({
            data: {
                type: 'egresados',
                id: String(loginResult.user.id),
                attributes: {
                    nombre: loginResult.user.nombre,
                    email: loginResult.email,
                    mensaje: 'Sesión iniciada correctamente',
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.loginController = loginController;
