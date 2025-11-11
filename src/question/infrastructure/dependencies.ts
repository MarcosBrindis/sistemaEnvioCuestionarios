import { CreateQuestion } from '../application/usecase/CreateQuestion';
import { UpdateQuestion } from '../application/usecase/UpdateQuestion';
import { DeleteQuestion } from '../application/usecase/DeleteQuestion';
import { GetQuestionById, GetAllQuestions, GetQuestionsByTypeId, SearchQuestionsByText } from '../application/usecase/GetQuestion';
import { QuestionRepositoryMySQL } from './database/mysql/QuestionRepositoryMySQL';

// Instancia del repositorio unificado
const questionRepo = new QuestionRepositoryMySQL();

export const dependencies = {
  createQuestion: new CreateQuestion(questionRepo),
  updateQuestion: new UpdateQuestion(questionRepo),
  deleteQuestion: new DeleteQuestion(questionRepo),
  getQuestionById: new GetQuestionById(questionRepo),
  getAllQuestions: new GetAllQuestions(questionRepo),
  getQuestionsByTypeId: new GetQuestionsByTypeId(questionRepo),
  searchQuestionsByText: new SearchQuestionsByText(questionRepo),
};
