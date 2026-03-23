"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.egresadoRepository = exports.dependencies = void 0;
const PlatinumAPI_1 = require("./external/PlatinumAPI");
const SyncEgresadosFromPlatinum_1 = require("../application/usecase/SyncEgresadosFromPlatinum");
const ActualizarPeriodosEgresados_1 = require("../application/usecase/ActualizarPeriodosEgresados");
const EgresadoRepositoryMYSQL_1 = require("./database/mysql/EgresadoRepositoryMYSQL");
const UpdateEgresadoPerfil_1 = require("../application/usecase/UpdateEgresadoPerfil");
const UpdatePerfilCompleto_1 = require("../application/usecase/UpdatePerfilCompleto");
const UpdatePerfilCompletoAdmin_1 = require("../application/usecase/UpdatePerfilCompletoAdmin");
const UpdateEstadoEgresado_1 = require("../application/usecase/UpdateEstadoEgresado");
const PeriodoRepositoryMYSQL_1 = require("./database/mysql/PeriodoRepositoryMYSQL");
const ProgramaEducativoRepositoryMYSQL_1 = require("./database/mysql/ProgramaEducativoRepositoryMYSQL");
const GetProgramasEducativos_1 = require("../application/usecase/GetProgramasEducativos");
const GetEgresadoWithAchievements_1 = require("../application/usecase/GetEgresadoWithAchievements");
const GetAllEgresadosWithAchievements_1 = require("../application/usecase/GetAllEgresadosWithAchievements");
const dependencies_1 = require("../../files/infrastructure/dependencies");
const egresadoRepo = new EgresadoRepositoryMYSQL_1.EgresadoRepositoryMySQL();
const periodoRepo = new PeriodoRepositoryMYSQL_1.PeriodoRepositoryMySQL();
const programaRepo = new ProgramaEducativoRepositoryMYSQL_1.ProgramaEducativoRepositoryMySQL();
const platinumAPI = new PlatinumAPI_1.PlatinumAPI();
const BATCH_SIZE = parseInt(process.env.EGRESADOS_BATCH_SIZE || '50');
exports.dependencies = {
    syncEgresadosFromPlatinum: new SyncEgresadosFromPlatinum_1.SyncEgresadosFromPlatinum(platinumAPI, egresadoRepo, periodoRepo, programaRepo, BATCH_SIZE),
    actualizarPeriodosEgresados: new ActualizarPeriodosEgresados_1.ActualizarPeriodosEgresados(platinumAPI, egresadoRepo, periodoRepo, BATCH_SIZE),
    getProgramasEducativos: new GetProgramasEducativos_1.GetProgramasEducativos(programaRepo),
    egresadoRepository: egresadoRepo,
    periodoRepository: periodoRepo,
    programaEducativoRepository: programaRepo,
    updateEgresadoPerfil: new UpdateEgresadoPerfil_1.UpdateEgresadoPerfil(egresadoRepo),
    updatePerfilCompleto: new UpdatePerfilCompleto_1.UpdatePerfilCompleto(egresadoRepo),
    updatePerfilCompletoAdmin: new UpdatePerfilCompletoAdmin_1.UpdatePerfilCompletoAdmin(egresadoRepo),
    uploadFile: dependencies_1.fileDependencies.uploadFile,
    updateEstadoEgresado: new UpdateEstadoEgresado_1.UpdateEstadoEgresado(egresadoRepo),
    getEgresadoWithAchievements: new GetEgresadoWithAchievements_1.GetEgresadoWithAchievements(egresadoRepo, programaRepo),
    getAllEgresadosWithAchievements: new GetAllEgresadosWithAchievements_1.GetAllEgresadosWithAchievements(egresadoRepo, programaRepo)
};
exports.egresadoRepository = egresadoRepo;
