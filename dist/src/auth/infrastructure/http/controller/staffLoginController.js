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
exports.staffLoginController = void 0;
const dependencies_1 = require("../../dependencies");
const staffLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        if (!data || data.type !== 'auth-staff') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const attrs = data.attributes || {};
        if (!attrs.email || !attrs.password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }
        const loginResult = yield dependencies_1.loginStaffUsecase.execute(String(attrs.email), String(attrs.password));
        if (!loginResult) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        req.session.user = loginResult.user;
        return res.status(200).json({
            data: {
                type: 'usuarios-internos',
                id: String(loginResult.user.id),
                attributes: {
                    nombre: loginResult.user.nombre,
                    email: loginResult.user.email,
                    rol: loginResult.user.rol,
                    mensaje: 'Sesión iniciada correctamente',
                },
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.staffLoginController = staffLoginController;
