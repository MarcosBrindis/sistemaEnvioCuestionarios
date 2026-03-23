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
exports.getQuestionsWithOptionsController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getQuestionsWithOptionsController = (getQuestionsWithOptions) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todas las preguntas con opciones
        const questionsWithOptions = yield getQuestionsWithOptions.execute();
        // Respuesta con formato JSON API para colección
        res.status(200).json({
            data: questionsWithOptions.map(question => {
                var _a, _b;
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
                                id: question.id_tipo_pregunta.toString(),
                                nombre: question.tipo_pregunta_nombre
                            }
                        }
                    },
                    included: {
                        opciones: ((_b = question.opciones) === null || _b === void 0 ? void 0 : _b.map((opcion) => {
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
                });
            }),
            meta: {
                total: questionsWithOptions.length
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getQuestionsWithOptionsController = getQuestionsWithOptionsController;
