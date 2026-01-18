import { SurveyRepositoryMySQL } from './database/mysql/SurveyRepositoryMySQL';
import { CreateSurvey } from '../application/usecase/CreateSurvey';
import { GetSurveys } from '../application/usecase/GetSurveys';
import { GetSurveyById } from '../application/usecase/GetSurveyById';
import { UpdateSurvey } from '../application/usecase/UpdateSurvey';
import { DeleteSurvey } from '../application/usecase/DeleteSurvey';
import { createSurveyController } from './http/controller/createSurveyController';
import { getSurveysController } from './http/controller/getSurveysController';
import { getSurveyByIdController } from './http/controller/getSurveyByIdController';
import { updateSurveyController } from './http/controller/updateSurveyController';
import { deleteSurveyController } from './http/controller/deleteSurveyController';

// Instancias
const surveyRepository = new SurveyRepositoryMySQL();
const createSurveyUseCase = new CreateSurvey(surveyRepository);
const getSurveysUseCase = new GetSurveys(surveyRepository);
const getSurveyByIdUseCase = new GetSurveyById(surveyRepository);
const updateSurveyUseCase = new UpdateSurvey(surveyRepository);
const deleteSurveyUseCase = new DeleteSurvey(surveyRepository);

export {
  surveyRepository,
  createSurveyUseCase,
  getSurveysUseCase,
  getSurveyByIdUseCase,
  updateSurveyUseCase,
  deleteSurveyUseCase,
  createSurveyController,
  getSurveysController,
  getSurveyByIdController,
  updateSurveyController,
  deleteSurveyController,
};
