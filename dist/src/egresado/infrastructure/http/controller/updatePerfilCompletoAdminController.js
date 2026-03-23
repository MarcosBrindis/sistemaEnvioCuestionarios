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
exports.updatePerfilCompletoAdminController = void 0;
const updatePerfilCompletoAdminController = (updatePerfilCompletoAdmin, uploadFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const egresadoId = Number(req.params.id);
        const bodyData = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data;
        const parsedData = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;
        const attrs = (parsedData === null || parsedData === void 0 ? void 0 : parsedData.attributes) || {};
        const nombre = (_b = attrs.nombre) !== null && _b !== void 0 ? _b : req.body.nombre;
        const primer_apellido = (_c = attrs.primer_apellido) !== null && _c !== void 0 ? _c : req.body.primer_apellido;
        const segundo_apellido = (_d = attrs.segundo_apellido) !== null && _d !== void 0 ? _d : req.body.segundo_apellido;
        const email = (_e = attrs.email) !== null && _e !== void 0 ? _e : req.body.email;
        const fecha_nacimiento = (_f = attrs.fecha_nacimiento) !== null && _f !== void 0 ? _f : req.body.fecha_nacimiento;
        let imagen_egresado = (_g = attrs.imagen_egresado) !== null && _g !== void 0 ? _g : req.body.imagen_egresado;
        const idProgramaRaw = (_h = attrs.id_programa_educativo) !== null && _h !== void 0 ? _h : req.body.id_programa_educativo;
        const idPeriodoRaw = (_j = attrs.id_periodo) !== null && _j !== void 0 ? _j : req.body.id_periodo;
        const idEstadoRaw = (_k = attrs.id_estado) !== null && _k !== void 0 ? _k : req.body.id_estado;
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
            const result = yield uploadFile.execute(req.file.buffer, req.file.originalname, req.file.mimetype, req.file.size);
            imagen_egresado = `${req.protocol}://${req.get('host')}/uploads/${result.relativePath}`;
        }
        const result = yield updatePerfilCompletoAdmin.execute({
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
        });
        return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePerfilCompletoAdminController = updatePerfilCompletoAdminController;
