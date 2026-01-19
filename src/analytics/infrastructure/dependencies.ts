import { MysqlAnalyticsRepository } from './database/mysql/MysqlAnalyticsRepository';
import { GenerateSurveyReportUseCase } from '../application/usecase/GenerateSurveyReportUseCase';
import { GetSurveyStatsController } from './http/controller/GetSurveyStatsController';

const analyticsRepository = new MysqlAnalyticsRepository();
export const generateSurveyReportUseCase = new GenerateSurveyReportUseCase(analyticsRepository);

export const getSurveyStatsController = new GetSurveyStatsController(generateSurveyReportUseCase);
