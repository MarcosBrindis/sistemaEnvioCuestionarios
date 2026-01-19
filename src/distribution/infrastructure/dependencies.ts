import { MysqlParticipantRepository } from './database/mysql/MysqlParticipantRepository';
import { MysqlTemplateRepository } from './database/mysql/MysqlTemplateRepository';
import { RestMailingService } from './adapter/RestMailingService';
import { TemplateEngineService } from '../application/service/TemplateEngineService';
import { DispatchSurveyRemindersUseCase } from '../application/usecase/DispatchSurveyRemindersUseCase';
import { DispatchController } from './http/controller/DispatchController';

const participantRepository = new MysqlParticipantRepository();
const templateRepository = new MysqlTemplateRepository();
const mailingClient = new RestMailingService();
const templateEngine = new TemplateEngineService();

export const dispatchSurveyRemindersUseCase = new DispatchSurveyRemindersUseCase(
  participantRepository,
  templateRepository,
  mailingClient,
  templateEngine
);

export const dispatchController = new DispatchController(dispatchSurveyRemindersUseCase);
