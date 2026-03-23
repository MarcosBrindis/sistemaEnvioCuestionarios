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
exports.updateOpcionPreguntaController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const updateOpcionPreguntaController = (updateOpcionPregunta) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'ID debe ser un número válido'
                }
            });
            return;
        }
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
        const updateData = {};
        // Extraer atributos - Soportar ambos formatos: kebab-case y snake_case
        if (req.body.data.attributes['texto-opcion'] !== undefined) {
            updateData.texto_opcion = req.body.data.attributes['texto-opcion'];
        }
        else if (req.body.data.attributes['texto_opcion'] !== undefined) {
            updateData.texto_opcion = req.body.data.attributes['texto_opcion'];
        }
        if (req.body.data.attributes.etiqueta !== undefined) {
            updateData.etiqueta = req.body.data.attributes.etiqueta;
        }
        // Extraer relaciones si están presentes
        if ((_c = (_b = (_a = req.body.data.relationships) === null || _a === void 0 ? void 0 : _a.pregunta) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id) {
            updateData.id_pregunta = Number(req.body.data.relationships.pregunta.data.id);
        }
        // Actualizar la opción
        const updatedOpcionPregunta = yield updateOpcionPregunta.execute(id, updateData);
        // Respuesta en formato JSON API
        res.status(200).json({
            data: {
                id: (_d = updatedOpcionPregunta.id_opcion_pregunta) === null || _d === void 0 ? void 0 : _d.toString(),
                type: 'opcion-pregunta',
                attributes: {
                    'texto-opcion': updatedOpcionPregunta.texto_opcion,
                    etiqueta: updatedOpcionPregunta.etiqueta
                },
                relationships: {
                    pregunta: {
                        data: {
                            id: updatedOpcionPregunta.id_pregunta.toString(),
                            type: 'pregunta'
                        }
                    }
                }
            }
        });
    }
    catch (error) {
        console.log('Error en UPDATE opción:', error.message); // Debug
        if (error.message.includes('no existe')) {
            res.status(404).json({
                error: {
                    status: '404',
                    title: 'Not Found',
                    detail: error.message
                }
            });
        }
        else if (error.message.includes('campo') || error.message.includes('obligatorio') ||
            error.message.includes('vacío') || error.message.includes('existe')) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
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
            (0, errorHandler_1.handleUpdateError)(error, req, res, next);
        }
    }
});
exports.updateOpcionPreguntaController = updateOpcionPreguntaController;
