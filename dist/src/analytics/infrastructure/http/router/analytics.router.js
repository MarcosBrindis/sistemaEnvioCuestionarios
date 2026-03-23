"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const router = (0, express_1.Router)();
router.get('/survey/:id_encuesta', dependencies_1.getSurveyStatsController.run.bind(dependencies_1.getSurveyStatsController));
exports.default = router;
