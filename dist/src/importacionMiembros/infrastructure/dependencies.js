"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const ImportarMiembrosPorFiltro_1 = require("../application/usecase/ImportarMiembrosPorFiltro");
const ImportacionMiembrosServiceImpl_1 = require("../infrastructure/ImportacionMiembrosServiceImpl");
const BuscarEgresadosPorFiltro_1 = require("../application/usecase/BuscarEgresadosPorFiltro");
const EgresadoRepositoryMYSQL_1 = require("../../egresado/infrastructure/database/mysql/EgresadoRepositoryMYSQL");
const GroupRepositoryMySQL_1 = require("../../group/infrastructure/database/mysql/GroupRepositoryMySQL");
const egresadoRepository = new EgresadoRepositoryMYSQL_1.EgresadoRepositoryMySQL();
const groupRepository = new GroupRepositoryMySQL_1.GroupRepositoryMySQL();
const importacionMiembrosService = new ImportacionMiembrosServiceImpl_1.ImportacionMiembrosServiceImpl(egresadoRepository, groupRepository);
exports.dependencies = {
    importarMiembrosPorFiltro: new ImportarMiembrosPorFiltro_1.ImportarMiembrosPorFiltro(importacionMiembrosService),
    buscarEgresadosPorFiltro: new BuscarEgresadosPorFiltro_1.BuscarEgresadosPorFiltro(egresadoRepository)
};
