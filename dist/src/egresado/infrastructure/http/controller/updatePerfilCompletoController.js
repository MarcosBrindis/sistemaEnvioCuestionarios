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
exports.updatePerfilCompletoController = void 0;
const updatePerfilCompletoController = (updatePerfilCompleto, uploadFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
        const nombre = (_c = attrs.nombre) !== null && _c !== void 0 ? _c : req.body.nombre;
        const primer_apellido = (_d = attrs.primer_apellido) !== null && _d !== void 0 ? _d : req.body.primer_apellido;
        const segundo_apellido = (_e = attrs.segundo_apellido) !== null && _e !== void 0 ? _e : req.body.segundo_apellido;
        const email = (_f = attrs.email) !== null && _f !== void 0 ? _f : req.body.email;
        const fecha_nacimiento = (_g = attrs.fecha_nacimiento) !== null && _g !== void 0 ? _g : req.body.fecha_nacimiento;
        let imagen_egresado = (_h = attrs.imagen_egresado) !== null && _h !== void 0 ? _h : req.body.imagen_egresado;
        const idProgramaRaw = (_j = attrs.id_programa_educativo) !== null && _j !== void 0 ? _j : req.body.id_programa_educativo;
        const idPeriodoRaw = (_k = attrs.id_periodo) !== null && _k !== void 0 ? _k : req.body.id_periodo;
        const idEstadoRaw = (_l = attrs.id_estado) !== null && _l !== void 0 ? _l : req.body.id_estado;
        const id_programa_educativo = idProgramaRaw !== undefined && idProgramaRaw !== ''
            ? Number(idProgramaRaw)
            : undefined;
        const id_periodo = idPeriodoRaw !== undefined && idPeriodoRaw !== ''
            ? Number(idPeriodoRaw)
            : undefined;
        const id_estado = idEstadoRaw !== undefined && idEstadoRaw !== ''
            ? Number(idEstadoRaw)
            : undefined;
        if (req.file) {
            const result = yield uploadFile.execute(req.file.buffer, req.file.originalname, req.file.mimetype, req.file.size, sessionEgresadoId);
            imagen_egresado = `${req.protocol}://${req.get('host')}/uploads/${result.relativePath}`;
        }
        const result = yield updatePerfilCompleto.execute({
            id: egresadoId,
            nombre,
            primer_apellido,
            segundo_apellido,
            email,
            fecha_nacimiento,
            imagen_egresado,
            id_programa_educativo: Number.isNaN(id_programa_educativo) ? undefined : id_programa_educativo,
            id_periodo: Number.isNaN(id_periodo) ? undefined : id_periodo,
            id_estado: Number.isNaN(id_estado) ? undefined : id_estado,
            sessionEgresadoId,
        });
        return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePerfilCompletoController = updatePerfilCompletoController;
