import { CreateTypeQuestion } from '../application/usecase/CreateTypeQuestion';
import { UpdateTypeQuestion } from '../application/usecase/UpdateTypeQuestion';
import { DeleteTypeQuestion } from '../application/usecase/DeleteTypeQuestion';
import { GetTypeQuestionById, GetAllTypeQuestions } from '../application/usecase/GetTypeQuestion';
import { TypeQuestionRepositoryMySQL } from './database/mysql/TypeQuestionRepositoryMySQL';

// Instancia del repositorio unificado
const typeQuestionRepo = new TypeQuestionRepositoryMySQL();

export const dependencies = {
  createTypeQuestion: new CreateTypeQuestion(typeQuestionRepo),
  updateTypeQuestion: new UpdateTypeQuestion(typeQuestionRepo),
  deleteTypeQuestion: new DeleteTypeQuestion(typeQuestionRepo),
  getTypeQuestionById: new GetTypeQuestionById(typeQuestionRepo),
  getAllTypeQuestions: new GetAllTypeQuestions(typeQuestionRepo),
};
