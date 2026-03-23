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
exports.UpdateQuestion = void 0;
class UpdateQuestion {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si la pregunta existe
            const existingQuestion = yield this.repo.findById(id);
            if (!existingQuestion) {
                throw new Error('La pregunta no existe');
            }
            // Si se está actualizando el texto_pregunta, validar reglas de negocio
            if (data.texto_pregunta !== undefined) {
                // Regla: El campo texto_pregunta no puede ser nulo ni vacío
                if (typeof data.texto_pregunta !== 'string' || data.texto_pregunta.trim() === '') {
                    throw new Error('El campo texto_pregunta no puede estar vacío');
                }
                // Normalizar el texto
                data.texto_pregunta = data.texto_pregunta.trim();
            }
            // Si se está actualizando el tipo de pregunta, validaciones especiales
            if (data.id_tipo_pregunta !== undefined) {
                const typeQuestionExists = yield this.repo.typeQuestionExists(data.id_tipo_pregunta);
                if (!typeQuestionExists) {
                    throw new Error('El tipo de pregunta especificado no existe');
                }
                // Verificar si hay opciones existentes
                const existingOptionsCount = yield this.repo.countOptionsByQuestionId(id);
                // Obtener el nombre del nuevo tipo
                const newTipoNombre = yield this.repo.getTypeQuestionName(data.id_tipo_pregunta);
                const newTipoLower = newTipoNombre === null || newTipoNombre === void 0 ? void 0 : newTipoNombre.toLowerCase();
                // Regla: Si cambia a "abierta" y tiene opciones, avisar al usuario
                if (newTipoLower === 'abierta' && existingOptionsCount > 0) {
                    throw new Error('No se puede cambiar a tipo "abierta" porque esta pregunta tiene opciones asociadas. Elimine las opciones primero.');
                }
                // Regla: Si cambia a "boolean" y tiene más de 2 opciones, avisar
                if (newTipoLower === 'boolean' && existingOptionsCount > 2) {
                    throw new Error('No se puede cambiar a tipo "boolean" porque esta pregunta tiene más de 2 opciones. Debe tener exactamente 2 opciones.');
                }
                // Regla: Si cambia a "likert", INFORMAR pero NO hacer nada automático
                if (newTipoLower === 'likert') {
                    console.log('AVISO: Pregunta cambiada a tipo "likert". Las opciones existentes se mantienen. Si desea opciones likert estándar, debe gestionarlas manualmente.');
                }
            }
            return yield this.repo.update(id, data);
        });
    }
}
exports.UpdateQuestion = UpdateQuestion;
