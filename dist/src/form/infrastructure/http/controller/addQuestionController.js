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
exports.addPreguntaController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const addPreguntaController = (addQuestion) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const formularioId = Number(req.params.id);
        if (isNaN(formularioId)) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID de formulario inválido' } });
            return;
        }
        if (!req.body.data || !req.body.data.type || !req.body.data.id) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado en body.data (pregunta)' } });
            return;
        }
        const preguntaId = Number(req.body.data.id);
        const orden = Number((_a = req.body.meta) === null || _a === void 0 ? void 0 : _a.orden);
        if (isNaN(preguntaId) || isNaN(orden)) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'preguntaId y orden deben ser numéricos' } });
            return;
        }
        yield addQuestion.execute(formularioId, preguntaId, orden);
        res.status(201).json({
            data: {
                type: 'formulacion-pregunta',
                attributes: {
                    id_formulario: formularioId.toString(),
                    id_pregunta: preguntaId.toString(),
                    orden
                }
            }
        });
    }
    catch (error) {
        if (error.message.includes('no existe') || error.message.includes('No existe')) {
            res.status(404).json({ error: { status: '404', title: 'Not Found', detail: error.message } });
        }
        else if (error.message.includes('Ya existe') || error.message.includes('ya')) {
            res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message } });
        }
        else if (error.message.includes('orden')) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: error.message } });
        }
        else {
            (0, errorHandler_1.handlePostError)(error, req, res, next);
        }
    }
});
exports.addPreguntaController = addPreguntaController;
