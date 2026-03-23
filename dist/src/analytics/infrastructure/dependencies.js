"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurveyStatsController = exports.generateSurveyReportUseCase = void 0;
const MysqlAnalyticsRepository_1 = require("./database/mysql/MysqlAnalyticsRepository");
const GenerateSurveyReportUseCase_1 = require("../application/usecase/GenerateSurveyReportUseCase");
const GetSurveyStatsController_1 = require("./http/controller/GetSurveyStatsController");
const analyticsRepository = new MysqlAnalyticsRepository_1.MysqlAnalyticsRepository();
exports.generateSurveyReportUseCase = new GenerateSurveyReportUseCase_1.GenerateSurveyReportUseCase(analyticsRepository);
exports.getSurveyStatsController = new GetSurveyStatsController_1.GetSurveyStatsController(exports.generateSurveyReportUseCase);
