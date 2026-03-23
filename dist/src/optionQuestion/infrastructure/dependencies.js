"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const CreateOpcionPregunta_1 = require("../application/usecase/CreateOpcionPregunta");
const UpdateOpcionPregunta_1 = require("../application/usecase/UpdateOpcionPregunta");
const DeleteOpcionPregunta_1 = require("../application/usecase/DeleteOpcionPregunta");
const GetOpcionPregunta_1 = require("../application/usecase/GetOpcionPregunta");
const OpcionPreguntaRepositoryMySQL_1 = require("./database/mysql/OpcionPreguntaRepositoryMySQL");
// Instancia del repositorio
const opcionPreguntaRepo = new OpcionPreguntaRepositoryMySQL_1.OpcionPreguntaRepositoryMySQL();
exports.dependencies = {
    createOpcionPregunta: new CreateOpcionPregunta_1.CreateOpcionPregunta(opcionPreguntaRepo),
    updateOpcionPregunta: new UpdateOpcionPregunta_1.UpdateOpcionPregunta(opcionPreguntaRepo),
    deleteOpcionPregunta: new DeleteOpcionPregunta_1.DeleteOpcionPregunta(opcionPreguntaRepo),
    getOpcionPreguntaById: new GetOpcionPregunta_1.GetOpcionPreguntaById(opcionPreguntaRepo),
    getAllOpcionesPreguntas: new GetOpcionPregunta_1.GetAllOpcionesPreguntas(opcionPreguntaRepo),
    getOpcionPreguntasByQuestionId: new GetOpcionPregunta_1.GetOpcionPreguntasByQuestionId(opcionPreguntaRepo),
};
