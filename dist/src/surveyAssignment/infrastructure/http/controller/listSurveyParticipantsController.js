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
exports.listSurveyParticipantsController = void 0;
// import { errorHandler } from '../../../../core/middleware/errorHandler';
const listSurveyParticipantsController = (listSurveyParticipants) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEncuesta = Number(req.params.id);
        const { page = 1, limit = 10, filtro_acceso, estado_respuesta, busqueda } = req.query;
        const options = {
            page: Number(page),
            limit: Number(limit),
            filtro_acceso: filtro_acceso,
            estado_respuesta: estado_respuesta,
            busqueda: busqueda,
        };
        const result = yield listSurveyParticipants.execute(idEncuesta, options);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.listSurveyParticipantsController = listSurveyParticipantsController;
