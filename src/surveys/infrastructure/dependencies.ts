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
import { GetPublicSurveyByUuid } from '../application/usecase/GetPublicSurveyByUuid';
import { GetSurveyFormattedByUuid } from '../application/usecase/GetSurveyFormattedByUuid';
import { SubmitPublicSurveyResponseUseCase } from '../application/usecase/SubmitPublicSurveyResponseUseCase';
import { FormularioRepositoryMySQL } from '../../form/infrastructure/database/mysql/FormRepositoryMYSQL';
import { respuestaRepository } from '../../respuesta/infrastructure/dependencies';
import { SurveyAssignmentRepositoryMySQL } from '../../surveyAssignment/infrastructure/database/mysql/SurveyAssignmentRepositoryMySQL';

// Instancias
const surveyRepository = new SurveyRepositoryMySQL();
const formularioRepository = new FormularioRepositoryMySQL();
const surveyAssignmentRepository = new SurveyAssignmentRepositoryMySQL();
const createSurveyUseCase = new CreateSurvey(surveyRepository);
const getSurveysUseCase = new GetSurveys(surveyRepository);
const getSurveyByIdUseCase = new GetSurveyById(surveyRepository);
const updateSurveyUseCase = new UpdateSurvey(surveyRepository);
const deleteSurveyUseCase = new DeleteSurvey(surveyRepository);
const getPublicSurveyByUuidUseCase = new GetPublicSurveyByUuid(formularioRepository);
const getSurveyFormattedByUuidUseCase = new GetSurveyFormattedByUuid(formularioRepository, surveyAssignmentRepository);
const submitPublicSurveyResponseUseCase = new SubmitPublicSurveyResponseUseCase(respuestaRepository, surveyAssignmentRepository);

export {
  surveyRepository,
  createSurveyUseCase,
  getSurveysUseCase,
  getSurveyByIdUseCase,
  getPublicSurveyByUuidUseCase,
  getSurveyFormattedByUuidUseCase,
  submitPublicSurveyResponseUseCase,
  updateSurveyUseCase,
  deleteSurveyUseCase,
  createSurveyController,
  getSurveysController,
  getSurveyByIdController,
  updateSurveyController,
  deleteSurveyController,
};
