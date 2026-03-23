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
exports.buscarEgresadosController = void 0;
const buscarEgresadosController = (buscarEgresadosPorFiltro) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawEstatus = Array.isArray(req.query.estatus) ? req.query.estatus[0] : req.query.estatus;
        const normalizedEstatus = rawEstatus !== undefined ? String(rawEstatus).trim() : undefined;
        const parsedEstatus = normalizedEstatus !== undefined ? Number(normalizedEstatus) : undefined;
        const estatus = normalizedEstatus
            ? (Number.isNaN(parsedEstatus) ? normalizedEstatus : parsedEstatus)
            : undefined;
        const filtros = {
            id_programa_educativo: req.query.id_programa_educativo ? Number(req.query.id_programa_educativo) : undefined,
            id_periodo_egreso: req.query.id_periodo_egreso ? Number(req.query.id_periodo_egreso) : undefined,
            cohorte: req.query.cohorte ? Number(req.query.cohorte) : undefined,
            prefijo_matricula: req.query.prefijo_matricula ? String(req.query.prefijo_matricula) : undefined,
            estatus,
            busqueda: req.query.busqueda,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20
        };
        const resultado = yield buscarEgresadosPorFiltro.execute(filtros);
        res.status(200).json({
            data: resultado.data,
            meta: {
                total: resultado.total,
                page: resultado.page,
                limit: resultado.limit
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.buscarEgresadosController = buscarEgresadosController;
