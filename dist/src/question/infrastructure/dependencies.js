"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const CreateQuestion_1 = require("../application/usecase/CreateQuestion");
const UpdateQuestion_1 = require("../application/usecase/UpdateQuestion");
const DeleteQuestion_1 = require("../application/usecase/DeleteQuestion");
const GetQuestion_1 = require("../application/usecase/GetQuestion");
const QuestionRepositoryMySQL_1 = require("./database/mysql/QuestionRepositoryMySQL");
// Instancia del repositorio unificado
const questionRepo = new QuestionRepositoryMySQL_1.QuestionRepositoryMySQL();
exports.dependencies = {
    createQuestion: new CreateQuestion_1.CreateQuestion(questionRepo),
    updateQuestion: new UpdateQuestion_1.UpdateQuestion(questionRepo),
    deleteQuestion: new DeleteQuestion_1.DeleteQuestion(questionRepo),
    getQuestionById: new GetQuestion_1.GetQuestionById(questionRepo),
    getAllQuestions: new GetQuestion_1.GetAllQuestions(questionRepo),
    getQuestionsByTypeId: new GetQuestion_1.GetQuestionsByTypeId(questionRepo),
    searchQuestionsByText: new GetQuestion_1.SearchQuestionsByText(questionRepo),
    getQuestionsWithOptions: new GetQuestion_1.GetQuestionsWithOptions(questionRepo),
    getQuestionWithOptionsById: new GetQuestion_1.GetQuestionWithOptionsById(questionRepo),
};
