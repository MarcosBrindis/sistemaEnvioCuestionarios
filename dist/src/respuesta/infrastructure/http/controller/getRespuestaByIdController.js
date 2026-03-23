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
exports.getRespuestaByIdController = void 0;
const dependencies_1 = require("../../../infrastructure/dependencies");
const getRespuestaByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const respuesta = yield dependencies_1.respuestaRepository.findById(id);
        if (!respuesta) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }
        const data = {
            type: 'respuestas',
            id: String(respuesta.id_respuesta),
            attributes: {
                fecha_respuesta: respuesta.fecha_respuesta,
                respuestas_json: respuesta.respuestas_json,
            },
            relationships: {
                egresado: {
                    data: { type: 'egresados', id: String(respuesta.id_egresado) }
                },
                encuesta: {
                    data: { type: 'encuestas', id: String(respuesta.id_formulario) }
                }
            }
        };
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getRespuestaByIdController = getRespuestaByIdController;
