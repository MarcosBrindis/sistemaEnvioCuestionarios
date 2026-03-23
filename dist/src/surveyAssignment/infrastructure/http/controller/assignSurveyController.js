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
exports.assignSurveyController = void 0;
// import { errorHandler } from '../../../../core/middleware/errorHandler';
const assignSurveyController = (assignSurvey) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEncuesta = Number(req.params.id);
        const { data } = req.body;
        if (!data || !data.attributes) {
            return res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON:API requerido' } });
        }
        let egresados = [];
        if (Array.isArray(data.attributes.lista_egresados)) {
            egresados = data.attributes.lista_egresados;
            const result = yield assignSurvey.execute(idEncuesta, egresados);
            return res.status(200).json({ meta: result });
        }
        else if (data.attributes.id_group) {
            // Redirigir a la lógica de grupo
            req.body = { data: { attributes: { id_group: data.attributes.id_group } } };
            // Llama al controlador de grupo (de forma programática)
            // Necesitamos acceso a assignSurveyGroup, así que lo pasamos como dependencia
            // Esto requiere que el router pase ambas dependencias o que el controlador de grupo sea llamado aquí
            // Para simplicidad, replicamos la lógica aquí:
            const { assignmentDependencies } = require('../../dependencies');
            const assignSurveyGroup = assignmentDependencies.assignSurveyGroup;
            const idGroup = Number(data.attributes.id_group);
            const result = yield assignSurveyGroup.execute(idEncuesta, idGroup);
            return res.status(200).json({ meta: result });
        }
        else {
            return res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Debes enviar lista_egresados o id_group' } });
        }
    }
    catch (error) {
        // Puedes usar el middleware de Express para manejo de errores
        next(error);
    }
});
exports.assignSurveyController = assignSurveyController;
