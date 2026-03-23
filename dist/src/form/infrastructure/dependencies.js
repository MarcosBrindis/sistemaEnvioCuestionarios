"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const CreateForm_1 = require("../application/usecase/CreateForm");
const UpdateForm_1 = require("../application/usecase/UpdateForm");
const DeleteForm_1 = require("../application/usecase/DeleteForm");
const GetForm_1 = require("../application/usecase/GetForm");
const AddQuestionToForm_1 = require("../application/usecase/AddQuestionToForm");
const RemoveQuestionFromForm_1 = require("../application/usecase/RemoveQuestionFromForm");
const FormRepositoryMYSQL_1 = require("./database/mysql/FormRepositoryMYSQL");
const formularioRepo = new FormRepositoryMYSQL_1.FormularioRepositoryMySQL();
exports.dependencies = {
    formularioRepo,
    createFormulario: new CreateForm_1.CreateFormulario(formularioRepo),
    updateFormulario: new UpdateForm_1.UpdateFormulario(formularioRepo),
    deleteFormulario: new DeleteForm_1.DeleteFormulario(formularioRepo),
    getFormularioById: new GetForm_1.GetFormularioById(formularioRepo),
    getAllFormularios: new GetForm_1.GetAllFormularios(formularioRepo),
    addQuestionToFormulario: new AddQuestionToForm_1.AddQuestionToFormulario(formularioRepo),
    removeQuestionFromFormulario: new RemoveQuestionFromForm_1.RemoveQuestionFromFormulario(formularioRepo)
};
