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
exports.submitPublicSurveyResponseController = void 0;
const submitPublicSurveyResponseController = (submitResponse) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const uuid = String(req.params.uuid || '').trim();
        const respuestas_json = (_a = req.body) === null || _a === void 0 ? void 0 : _a.respuestas_json;
        if (!uuid) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'UUID requerido' } });
            return;
        }
        if (!respuestas_json) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Respuestas requeridas' } });
            return;
        }
        const result = yield submitResponse.execute(uuid, respuestas_json);
        res.status(201).json({
            data: {
                id_respuesta: result.id_respuesta,
                mensaje: result.mensaje
            }
        });
    }
    catch (error) {
        if (error.message === 'Acceso no encontrado') {
            res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Encuesta no encontrada' } });
            return;
        }
        if (error.message === 'Acceso revocado') {
            res.status(403).json({ error: { status: '403', title: 'Forbidden', detail: 'Acceso revocado' } });
            return;
        }
        if (error.message.includes('ya respondió')) {
            res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message } });
            return;
        }
        next(error);
    }
});
exports.submitPublicSurveyResponseController = submitPublicSurveyResponseController;
