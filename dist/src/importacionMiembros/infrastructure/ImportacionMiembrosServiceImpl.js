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
exports.ImportacionMiembrosServiceImpl = void 0;
class ImportacionMiembrosServiceImpl {
    constructor(egresadoRepository, groupRepository) {
        this.egresadoRepository = egresadoRepository;
        this.groupRepository = groupRepository;
    }
    importarMiembrosPorFiltro(idGrupo, filtros) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar egresados con filtros
            const egresados = yield this.egresadoRepository.buscarEgresadosAvanzado(filtros);
            const usuarios_encontrados = egresados.length;
            // Insertar masivamente en el grupo, evitando duplicados
            const ids = egresados.map(e => e.id_egresado).filter((id) => typeof id === 'number');
            const { nuevos_agregados, ya_estaban_en_grupo } = yield this.groupRepository.importarMiembrosPorFiltro(idGrupo, ids);
            return {
                mensaje: 'Importación completada',
                usuarios_encontrados,
                nuevos_agregados,
                ya_estaban_en_grupo
            };
        });
    }
}
exports.ImportacionMiembrosServiceImpl = ImportacionMiembrosServiceImpl;
