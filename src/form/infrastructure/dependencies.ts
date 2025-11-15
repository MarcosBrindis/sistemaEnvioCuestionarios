import { CreateFormulario } from '../application/usecase/CreateForm';
import { UpdateFormulario } from '../application/usecase/UpdateForm';
import { DeleteFormulario } from '../application/usecase/DeleteForm';
import { GetFormularioById, GetAllFormularios } from '../application/usecase/GetForm';
import { AddQuestionToFormulario } from '../application/usecase/AddQuestionToForm';
import { RemoveQuestionFromFormulario } from '../application/usecase/RemoveQuestionFromForm';
import { FormularioRepositoryMySQL } from './database/mysql/FormRepositoryMYSQL';

const formularioRepo = new FormularioRepositoryMySQL();

export const dependencies = {
  formularioRepo,
  createFormulario: new CreateFormulario(formularioRepo),
  updateFormulario: new UpdateFormulario(formularioRepo),
  deleteFormulario: new DeleteFormulario(formularioRepo),
  getFormularioById: new GetFormularioById(formularioRepo),
  getAllFormularios: new GetAllFormularios(formularioRepo),
  addQuestionToFormulario: new AddQuestionToFormulario(formularioRepo),
  removeQuestionFromFormulario: new RemoveQuestionFromFormulario(formularioRepo)
};
