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
exports.DeleteOpcionPregunta = void 0;
class DeleteOpcionPregunta {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si la opción existe
            const existingOption = yield this.repo.findById(id);
            if (!existingOption) {
                throw new Error('La opción de pregunta no existe');
            }
            // Obtener el tipo de pregunta para validar reglas de eliminación
            const questionType = yield this.repo.getQuestionType(existingOption.id_pregunta);
            if (!questionType) {
                throw new Error('No se pudo determinar el tipo de la pregunta asociada');
            }
            // Contar opciones existentes antes de eliminar
            const currentOptionsCount = yield this.repo.countOptionsByQuestionId(existingOption.id_pregunta);
            // Validar reglas específicas por tipo de pregunta antes de eliminar
            if (questionType === 'boolean' && currentOptionsCount <= 2) {
                throw new Error('Las preguntas de tipo "boolean" deben tener exactamente 2 opciones. No se puede eliminar esta opción.');
            }
            if ((questionType === 'multiple' || questionType === 'opción múltiple') && currentOptionsCount <= 2) {
                throw new Error('Las preguntas de tipo "multiple" deben tener al menos 2 opciones. No se puede eliminar esta opción.');
            }
            yield this.repo.delete(id);
        });
    }
}
exports.DeleteOpcionPregunta = DeleteOpcionPregunta;
