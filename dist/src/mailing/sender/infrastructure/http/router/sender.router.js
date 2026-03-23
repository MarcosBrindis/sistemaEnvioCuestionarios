"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const ApiKeyMiddleware_1 = require("../../../../shared/middleware/ApiKeyMiddleware");
const router = (0, express_1.Router)();
router.post('/send', ApiKeyMiddleware_1.ApiKeyMiddleware, dependencies_1.sendEmailController.run.bind(dependencies_1.sendEmailController));
exports.default = router;
