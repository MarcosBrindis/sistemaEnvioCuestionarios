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
exports.SubmitPublicSurveyResponseUseCase = void 0;
class SubmitPublicSurveyResponseUseCase {
    constructor(respuestaRepository, surveyAssignmentRepository) {
        this.respuestaRepository = respuestaRepository;
        this.surveyAssignmentRepository = surveyAssignmentRepository;
    }
    execute(uuid, respuestas_json) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield this.surveyAssignmentRepository.findByUuid(uuid);
            if (!assignment) {
                throw new Error('Acceso no encontrado');
            }
            if (!assignment.is_active) {
                throw new Error('Acceso revocado');
            }
            const respuesta = yield this.respuestaRepository.create({
                id_egresado: assignment.id_egresado,
                id_formulario: assignment.id_formulario,
                respuestas_json: respuestas_json
            });
            return {
                id_respuesta: respuesta.id_respuesta,
                mensaje: 'Respuestas registradas correctamente'
            };
        });
    }
}
exports.SubmitPublicSurveyResponseUseCase = SubmitPublicSurveyResponseUseCase;
