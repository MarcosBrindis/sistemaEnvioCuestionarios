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
exports.createRespuestaController = void 0;
const CreateRespuesta_1 = require("../../../application/usecase/CreateRespuesta");
const dependencies_1 = require("../../../infrastructure/dependencies");
const registrarRespuesta = new CreateRespuesta_1.RegistrarRespuesta(dependencies_1.respuestaRepository);
const createRespuestaController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { data } = req.body;
        if (!data || data.type !== 'respuestas') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const respuestas_json = (_a = data.attributes) === null || _a === void 0 ? void 0 : _a.respuestas_json;
        const egresadoId = (_d = (_c = (_b = data.relationships) === null || _b === void 0 ? void 0 : _b.egresado) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id;
        const formularioId = (_g = (_f = (_e = data.relationships) === null || _e === void 0 ? void 0 : _e.encuesta) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.id;
        if (!egresadoId || !formularioId || !respuestas_json) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
        const respuesta = yield registrarRespuesta.execute({
            id_egresado: Number(egresadoId),
            id_formulario: Number(formularioId),
            respuestas_json,
        });
        res.status(201).json({
            data: {
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
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createRespuestaController = createRespuestaController;
