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
exports.BuscarEgresadosPorFiltro = void 0;
class BuscarEgresadosPorFiltro {
    constructor(egresadoRepository) {
        this.egresadoRepository = egresadoRepository;
    }
    execute(filtros) {
        return __awaiter(this, void 0, void 0, function* () {
            // Lógica de paginación
            const page = filtros.page || 1;
            const limit = filtros.limit || 20;
            const offset = (page - 1) * limit;
            // Construir filtros para el repositorio
            const repoFiltros = {};
            if (filtros.id_programa_educativo)
                repoFiltros.id_programa_educativo = filtros.id_programa_educativo;
            if (filtros.id_periodo_egreso)
                repoFiltros.id_periodo_egreso = filtros.id_periodo_egreso;
            if (filtros.cohorte)
                repoFiltros.cohorte = filtros.cohorte;
            if (filtros.prefijo_matricula)
                repoFiltros.prefijo_matricula = filtros.prefijo_matricula;
            if (filtros.estatus !== undefined && filtros.estatus !== '')
                repoFiltros.estatus = filtros.estatus;
            if (filtros.busqueda)
                repoFiltros.busqueda = filtros.busqueda;
            // Buscar todos los egresados que cumplen el filtro
            const todos = yield this.egresadoRepository.buscarEgresadosAvanzado(repoFiltros);
            const total = todos.length;
            // Paginar
            const data = todos.slice(offset, offset + limit);
            return { data, total, page, limit };
        });
    }
}
exports.BuscarEgresadosPorFiltro = BuscarEgresadosPorFiltro;
