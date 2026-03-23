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
exports.getQuestionsController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const QuestionRepositoryMySQL_1 = require("../../database/mysql/QuestionRepositoryMySQL");
const questionRepo = new QuestionRepositoryMySQL_1.QuestionRepositoryMySQL();
const getQuestionsController = (getAllQuestions, searchQuestionsByText) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { id } = req.params;
        const { texto } = req.query;
        // Si hay query parameter 'texto', realizar búsqueda
        if (texto && typeof texto === 'string') {
            const questions = yield searchQuestionsByText.execute(texto);
            // Respuesta con formato JSON API para colección de búsqueda
            res.status(200).json({
                data: questions.map(question => {
                    var _a;
                    return ({
                        type: 'preguntas',
                        id: (_a = question.id_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
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
                    });
                }),
                meta: {
                    total: questions.length,
                    query: texto
                }
            });
            return;
        }
        // Si hay ID, buscar una específica CON OPCIONES
        if (id) {
            const questionWithOptions = yield questionRepo.getQuestionWithOptions(Number(id));
            if (!questionWithOptions) {
                res.status(404).json({
                    error: {
                        status: '404',
                        title: 'Not Found',
                        detail: 'La pregunta no fue encontrada'
                    }
                });
                return;
            }
            // Verificar si es de tipo "abierta" y tiene opciones (excepción)
            const tipoNombre = (_a = questionWithOptions.tipo_pregunta_nombre) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (tipoNombre === 'abierta' && ((_b = questionWithOptions.opciones) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                res.status(400).json({
                    error: {
                        status: '400',
                        title: 'Bad Request',
                        detail: 'Las preguntas de tipo abierta no deben tener opciones asociadas'
                    }
                });
                return;
            }
            // Respuesta con formato JSON API para un recurso con opciones anidadas
            res.status(200).json({
                data: {
                    type: 'preguntas',
                    id: (_c = questionWithOptions.id_pregunta) === null || _c === void 0 ? void 0 : _c.toString(),
                    attributes: {
                        texto_pregunta: questionWithOptions.texto_pregunta,
                        es_obligatoria: questionWithOptions.es_obligatoria
                    },
                    relationships: {
                        'tipo-pregunta': {
                            data: {
                                type: 'tipos-pregunta',
                                id: questionWithOptions.id_tipo_pregunta.toString()
                            }
                        },
                        opciones: {
                            data: ((_d = questionWithOptions.opciones) === null || _d === void 0 ? void 0 : _d.map((opcion) => {
                                var _a;
                                return ({
                                    type: 'opciones-pregunta',
                                    id: (_a = opcion.id_opcion_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                                    attributes: {
                                        texto_opcion: opcion.texto_opcion,
                                        etiqueta: opcion.etiqueta
                                    }
                                });
                            })) || []
                        }
                    }
                }
            });
            return;
        }
        // Si no hay ID, obtener todas
        const questions = yield getAllQuestions.execute();
        // Respuesta con formato JSON API para colección
        res.status(200).json({
            data: questions.map(question => {
                var _a;
                return ({
                    type: 'preguntas',
                    id: (_a = question.id_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
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
                });
            })
        });
    }
    catch (error) {
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getQuestionsController = getQuestionsController;
