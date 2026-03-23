"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const CreateTypeQuestion_1 = require("../application/usecase/CreateTypeQuestion");
const UpdateTypeQuestion_1 = require("../application/usecase/UpdateTypeQuestion");
const DeleteTypeQuestion_1 = require("../application/usecase/DeleteTypeQuestion");
const GetTypeQuestion_1 = require("../application/usecase/GetTypeQuestion");
const TypeQuestionRepositoryMySQL_1 = require("./database/mysql/TypeQuestionRepositoryMySQL");
// Instancia del repositorio unificado
const typeQuestionRepo = new TypeQuestionRepositoryMySQL_1.TypeQuestionRepositoryMySQL();
exports.dependencies = {
    createTypeQuestion: new CreateTypeQuestion_1.CreateTypeQuestion(typeQuestionRepo),
    updateTypeQuestion: new UpdateTypeQuestion_1.UpdateTypeQuestion(typeQuestionRepo),
    deleteTypeQuestion: new DeleteTypeQuestion_1.DeleteTypeQuestion(typeQuestionRepo),
    getTypeQuestionById: new GetTypeQuestion_1.GetTypeQuestionById(typeQuestionRepo),
    getAllTypeQuestions: new GetTypeQuestion_1.GetAllTypeQuestions(typeQuestionRepo),
};
