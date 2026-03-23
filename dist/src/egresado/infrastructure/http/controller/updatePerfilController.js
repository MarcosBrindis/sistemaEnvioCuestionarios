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
exports.updatePerfilController = void 0;
const updatePerfilController = (updateEgresadoPerfil, uploadFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const egresadoId = Number(req.params.id);
        const sessionEgresadoId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!sessionEgresadoId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        if (egresadoId !== sessionEgresadoId) {
            return res.status(403).json({ error: 'No autorizado para editar este perfil' });
        }
        const bodyData = (_b = req.body) === null || _b === void 0 ? void 0 : _b.data;
        const parsedData = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;
        const attrs = (parsedData === null || parsedData === void 0 ? void 0 : parsedData.attributes) || {};
        const email = (_c = attrs.email) !== null && _c !== void 0 ? _c : req.body.email;
        const fecha_nacimiento = (_d = attrs.fecha_nacimiento) !== null && _d !== void 0 ? _d : req.body.fecha_nacimiento;
        let imagen_egresado = (_e = attrs.imagen_egresado) !== null && _e !== void 0 ? _e : req.body.imagen_egresado;
        if (req.file) {
            const result = yield uploadFile.execute(req.file.buffer, req.file.originalname, req.file.mimetype, req.file.size, sessionEgresadoId);
            imagen_egresado = `${req.protocol}://${req.get('host')}/uploads/${result.relativePath}`;
        }
        const result = yield updateEgresadoPerfil.execute({
            id: egresadoId,
            email,
            fecha_nacimiento,
            imagen_egresado,
            sessionEgresadoId,
        });
        return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePerfilController = updatePerfilController;
