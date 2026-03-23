"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const DatosLaboralesRepositoryMySQL_1 = require("./database/mysql/DatosLaboralesRepositoryMySQL");
const CreateDatosLaborales_1 = require("../application/usecase/CreateDatosLaborales");
const GetDatosLaboralesByEgresado_1 = require("../application/usecase/GetDatosLaboralesByEgresado");
const UpdateDatosLaborales_1 = require("../application/usecase/UpdateDatosLaborales");
const DeleteDatosLaborales_1 = require("../application/usecase/DeleteDatosLaborales");
const datosLaboralesRepo = new DatosLaboralesRepositoryMySQL_1.DatosLaboralesRepositoryMySQL();
exports.dependencies = {
    datosLaboralesRepository: datosLaboralesRepo,
    createDatosLaborales: new CreateDatosLaborales_1.CreateDatosLaborales(datosLaboralesRepo),
    getDatosLaboralesByEgresado: new GetDatosLaboralesByEgresado_1.GetDatosLaboralesByEgresado(datosLaboralesRepo),
    updateDatosLaborales: new UpdateDatosLaborales_1.UpdateDatosLaborales(datosLaboralesRepo),
    deleteDatosLaborales: new DeleteDatosLaborales_1.DeleteDatosLaborales(datosLaboralesRepo)
};
