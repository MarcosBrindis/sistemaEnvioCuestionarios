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
exports.getRespuestasController = void 0;
const dependencies_1 = require("../../../infrastructure/dependencies");
const getRespuestasController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_formulario, id_egresado } = req.query;
        const filtros = {};
        if (id_formulario)
            filtros.id_formulario = Number(id_formulario);
        if (id_egresado)
            filtros.id_egresado = Number(id_egresado);
        const respuestas = yield dependencies_1.respuestaRepository.findAll(filtros);
        const data = respuestas.map((respuesta) => ({
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
        }));
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getRespuestasController = getRespuestasController;
