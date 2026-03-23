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
exports.createQuestionController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const createQuestionController = (createQuestion) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Validar estructura JSON API
        if (!req.body.data || !req.body.data.attributes || !req.body.data.relationships) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'El formato debe seguir la especificación JSON API con relationships'
                }
            });
            return;
        }
        const { texto_pregunta, es_obligatoria } = req.body.data.attributes;
        const id_tipo_pregunta = Number((_b = (_a = req.body.data.relationships['tipo-pregunta']) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id);
        if (!id_tipo_pregunta) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'El campo tipo-pregunta es obligatorio en relationships'
                }
            });
            return;
        }
        const question = yield createQuestion.execute({ texto_pregunta, es_obligatoria, id_tipo_pregunta });
        // Respuesta con formato JSON API
        res.status(201).json({
            data: {
                type: 'preguntas',
                id: (_c = question.id_pregunta) === null || _c === void 0 ? void 0 : _c.toString(),
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
        (0, errorHandler_1.handlePostError)(error, req, res, next);
    }
});
exports.createQuestionController = createQuestionController;
