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
exports.GetSurveyFormattedByUuid = void 0;
class GetSurveyFormattedByUuid {
    constructor(formularioRepository, surveyAssignmentRepository) {
        this.formularioRepository = formularioRepository;
        this.surveyAssignmentRepository = surveyAssignmentRepository;
    }
    execute(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener asignación de encuesta y datos básicos
            const assignment = yield this.surveyAssignmentRepository.findByUuid(uuid);
            if (!assignment)
                return null;
            if (!assignment.is_active) {
                throw new Error('Acceso revocado');
            }
            // Obtener preguntas formateadas desde el repositorio
            const preguntas = yield this.formularioRepository.getQuestionsFormattedForPublic(assignment.id_formulario);
            return {
                titulo_encuesta: assignment.nombre_encuesta,
                descripcion: assignment.descripcion_encuesta,
                formulario: {
                    titulo: assignment.titulo_formulario,
                    preguntas: preguntas
                }
            };
        });
    }
}
exports.GetSurveyFormattedByUuid = GetSurveyFormattedByUuid;
