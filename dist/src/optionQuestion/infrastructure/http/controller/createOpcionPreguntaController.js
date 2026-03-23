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
exports.createOpcionPreguntaController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const createOpcionPreguntaController = (createOpcionPregunta) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Extraer atributos - Soportar ambos formatos: kebab-case y snake_case
        const texto_opcion = req.body.data.attributes['texto-opcion'] || req.body.data.attributes['texto_opcion'];
        const etiqueta = req.body.data.attributes.etiqueta;
        const id_pregunta = Number((_b = (_a = req.body.data.relationships['pregunta']) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id);
        if (!id_pregunta) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'El campo pregunta es obligatorio en relationships'
                }
            });
            return;
        }
        // Crear la opción
        const opcionPregunta = yield createOpcionPregunta.execute({
            texto_opcion,
            etiqueta,
            id_pregunta
        });
        // Respuesta en formato JSON API
        res.status(201).json({
            data: {
                id: (_c = opcionPregunta.id_opcion_pregunta) === null || _c === void 0 ? void 0 : _c.toString(),
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
    }
    catch (error) {
        console.log('Error en CREATE opción:', error.message); // Debug
        if (error.message.includes('campo') || error.message.includes('obligatorio') ||
            error.message.includes('vacío') || error.message.includes('existe')) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: error.message
                }
            });
        }
        else if (error.message.includes('no existe') || error.message.includes('no se pudo')) {
            res.status(404).json({
                error: {
                    status: '404',
                    title: 'Not Found',
                    detail: error.message
                }
            });
        }
        else if (error.message.includes('no pueden tener opciones') || error.message.includes('máximo') ||
            error.message.includes('mismo texto') || error.message.includes('misma etiqueta')) {
            res.status(409).json({
                error: {
                    status: '409',
                    title: 'Conflict',
                    detail: error.message
                }
            });
        }
        else {
            // Usar el error handler del middleware
            (0, errorHandler_1.handlePostError)(error, req, res, next);
        }
    }
});
exports.createOpcionPreguntaController = createOpcionPreguntaController;
