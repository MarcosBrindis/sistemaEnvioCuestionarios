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
exports.updateQuestionController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const updateQuestionController = (updateQuestion) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Validar estructura JSON API
        if (!req.body.data || !req.body.data.attributes) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'El formato debe seguir la especificación JSON API'
                }
            });
            return;
        }
        const id = Number(req.params.id);
        const { texto_pregunta, es_obligatoria } = req.body.data.attributes;
        // Extraer id_tipo_pregunta de relationships si existe
        let id_tipo_pregunta;
        if (req.body.data.relationships && req.body.data.relationships['tipo-pregunta']) {
            id_tipo_pregunta = Number((_a = req.body.data.relationships['tipo-pregunta'].data) === null || _a === void 0 ? void 0 : _a.id);
        }
        const question = yield updateQuestion.execute(id, { texto_pregunta, es_obligatoria, id_tipo_pregunta });
        // Respuesta con formato JSON API
        res.status(200).json({
            data: {
                type: 'preguntas',
                id: (_b = question.id_pregunta) === null || _b === void 0 ? void 0 : _b.toString(),
                attributes: {
                    texto_pregunta: question.texto_pregunta,
                    es_obligatoria: question.es_obligatoria
                },
                relationships: {
                    'tipo-pregunta': {
                        data: {
                            type: 'tipos-pregunta',
                            id: question.id_tipo_pregunta.toString()
                        }
                    }
                }
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handleUpdateError)(error, req, res, next);
    }
});
exports.updateQuestionController = updateQuestionController;
