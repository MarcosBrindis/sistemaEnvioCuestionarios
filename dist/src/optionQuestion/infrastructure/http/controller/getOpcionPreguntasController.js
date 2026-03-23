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
exports.getOpcionPreguntasController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getOpcionPreguntasController = (getOpcionPreguntaById, getAllOpcionesPreguntas, getOpcionPreguntasByQuestionId) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { preguntaId } = req.query;
        // Obtener por ID específico
        if (id) {
            const numId = Number(id);
            if (isNaN(numId)) {
                res.status(400).json({
                    error: {
                        status: '400',
                        title: 'Bad Request',
                        detail: 'ID debe ser un número válido'
                    }
                });
                return;
            }
            const opcionPregunta = yield getOpcionPreguntaById.execute(numId);
            if (!opcionPregunta) {
                res.status(404).json({
                    error: {
                        status: '404',
                        title: 'Not Found',
                        detail: 'Opción de pregunta no encontrada'
                    }
                });
                return;
            }
            res.status(200).json({
                data: {
                    id: (_a = opcionPregunta.id_opcion_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                    type: 'opcion-pregunta',
                    attributes: {
                        'texto-opcion': opcionPregunta.texto_opcion,
                        etiqueta: opcionPregunta.etiqueta
                    },
                    relationships: {
                        pregunta: {
                            data: {
                                id: opcionPregunta.id_pregunta.toString(),
                                type: 'pregunta'
                            }
                        }
                    }
                }
            });
            return;
        }
        // Filtrar por preguntaId si se proporciona
        if (preguntaId) {
            const numPreguntaId = Number(preguntaId);
            if (isNaN(numPreguntaId)) {
                res.status(400).json({
                    error: {
                        status: '400',
                        title: 'Bad Request',
                        detail: 'preguntaId debe ser un número válido'
                    }
                });
                return;
            }
            const opcionesPreguntas = yield getOpcionPreguntasByQuestionId.execute(numPreguntaId);
            res.status(200).json({
                data: opcionesPreguntas.map(opcionPregunta => {
                    var _a;
                    return ({
                        id: (_a = opcionPregunta.id_opcion_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                        type: 'opcion-pregunta',
                        attributes: {
                            'texto-opcion': opcionPregunta.texto_opcion,
                            etiqueta: opcionPregunta.etiqueta
                        },
                        relationships: {
                            pregunta: {
                                data: {
                                    id: opcionPregunta.id_pregunta.toString(),
                                    type: 'pregunta'
                                }
                            }
                        }
                    });
                })
            });
            return;
        }
        // Obtener todas las opciones de preguntas
        const opcionesPreguntas = yield getAllOpcionesPreguntas.execute();
        res.status(200).json({
            data: opcionesPreguntas.map(opcionPregunta => {
                var _a;
                return ({
                    id: (_a = opcionPregunta.id_opcion_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                    type: 'opcion-pregunta',
                    attributes: {
                        'texto-opcion': opcionPregunta.texto_opcion,
                        etiqueta: opcionPregunta.etiqueta
                    },
                    relationships: {
                        pregunta: {
                            data: {
                                id: opcionPregunta.id_pregunta.toString(),
                                type: 'pregunta'
                            }
                        }
                    }
                });
            })
        });
    }
    catch (error) {
        console.log('Error en GET opciones:', error.message); // Debug
        // Usar el error handler del middleware
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getOpcionPreguntasController = getOpcionPreguntasController;
