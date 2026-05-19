"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const router = (0, express_1.Router)();
router.post('/dispatch', dependencies_1.dispatchController.run.bind(dependencies_1.dispatchController));
router.post('/dispatch-birthday', dependencies_1.dispatchBirthdayController.run.bind(dependencies_1.dispatchBirthdayController));
router.post('/dispatch-birthday-test', dependencies_1.dispatchBirthdayTestController.run.bind(dependencies_1.dispatchBirthdayTestController));
exports.default = router;
