"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const DatosDomiciliariosRepositoryMySQL_1 = require("./database/mysql/DatosDomiciliariosRepositoryMySQL");
const CreateDatosDomiciliarios_1 = require("../application/usecase/CreateDatosDomiciliarios");
const GetDatosDomiciliariosByEgresado_1 = require("../application/usecase/GetDatosDomiciliariosByEgresado");
const UpdateDatosDomiciliarios_1 = require("../application/usecase/UpdateDatosDomiciliarios");
const DeleteDatosDomiciliarios_1 = require("../application/usecase/DeleteDatosDomiciliarios");
const datosDomiciliariosRepo = new DatosDomiciliariosRepositoryMySQL_1.DatosDomiciliariosRepositoryMySQL();
exports.dependencies = {
    datosDomiciliariosRepository: datosDomiciliariosRepo,
    createDatosDomiciliarios: new CreateDatosDomiciliarios_1.CreateDatosDomiciliarios(datosDomiciliariosRepo),
    getDatosDomiciliariosByEgresado: new GetDatosDomiciliariosByEgresado_1.GetDatosDomiciliariosByEgresado(datosDomiciliariosRepo),
    updateDatosDomiciliarios: new UpdateDatosDomiciliarios_1.UpdateDatosDomiciliarios(datosDomiciliariosRepo),
    deleteDatosDomiciliarios: new DeleteDatosDomiciliarios_1.DeleteDatosDomiciliarios(datosDomiciliariosRepo)
};
