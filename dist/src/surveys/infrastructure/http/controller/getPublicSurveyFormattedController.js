"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSurveyFormattedController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getPublicSurveyFormattedController = (getSurveyFormatted) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuid = String(req.params.uuid || '').trim();
        if (!uuid) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'UUID requerido' } });
            return;
        }
        const payload = yield getSurveyFormatted.execute(uuid);
        if (!payload) {
            res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Encuesta no encontrada' } });
            return;
        }
        res.status(200).json(payload);
    }
    catch (error) {
        if (error.message === 'Acceso revocado') {
            res.status(403).json({ error: { status: '403', title: 'Forbidden', detail: 'Acceso revocado' } });
            return;
        }
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getPublicSurveyFormattedController = getPublicSurveyFormattedController;
