import { MysqlParticipantRepository } from './database/mysql/MysqlParticipantRepository';
import { MysqlTemplateRepository } from './database/mysql/MysqlTemplateRepository';
import { RestMailingService } from './adapter/RestMailingService';
import { TemplateEngineService } from '../application/service/TemplateEngineService';
import { DispatchSurveyRemindersUseCase } from '../application/usecase/DispatchSurveyRemindersUseCase';
import { DispatchBirthdayCongratsUseCase } from '../application/usecase/DispatchBirthdayCongratsUseCase';
import { DispatchController } from './http/controller/DispatchController';
import { DispatchBirthdayController } from './http/controller/DispatchBirthdayController';
import { DispatchBirthdayTestController } from './http/controller/DispatchBirthdayTestController';
import { AssignmentRepositoryMySQL } from '../../surveyAssignment/infrastructure/database/mysql/AssignmentRepositoryMySQL';
import { AssignSurveyGroup } from '../../surveyAssignment/application/usecase/AssignSurveyGroup';

const participantRepository = new MysqlParticipantRepository();
const templateRepository = new MysqlTemplateRepository();
const mailingClient = new RestMailingService();
const templateEngine = new TemplateEngineService();
const assignmentRepository = new AssignmentRepositoryMySQL();
const assignSurveyGroup = new AssignSurveyGroup(assignmentRepository);

export const dispatchSurveyRemindersUseCase = new DispatchSurveyRemindersUseCase(
  participantRepository,
  templateRepository,
  mailingClient,
  templateEngine,
  assignSurveyGroup
);

export const dispatchBirthdayCongratsUseCase = new DispatchBirthdayCongratsUseCase(
  participantRepository,
  templateRepository,
  mailingClient,
  templateEngine
);

export const dispatchController = new DispatchController(dispatchSurveyRemindersUseCase);
export const dispatchBirthdayController = new DispatchBirthdayController(dispatchBirthdayCongratsUseCase);
export const dispatchBirthdayTestController = new DispatchBirthdayTestController(dispatchBirthdayCongratsUseCase);
