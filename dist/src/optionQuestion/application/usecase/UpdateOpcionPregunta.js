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
exports.UpdateOpcionPregunta = void 0;
class UpdateOpcionPregunta {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si la opción existe
            const existingOption = yield this.repo.findById(id);
            if (!existingOption) {
                throw new Error('La opción de pregunta no existe');
            }
            // Si se está actualizando el texto_opcion, validar reglas de negocio
            if (data.texto_opcion !== undefined) {
                // Regla: El campo texto_opcion no puede ser nulo ni vacío
                if (typeof data.texto_opcion !== 'string' || data.texto_opcion.trim() === '') {
                    throw new Error('El campo texto_opcion no puede estar vacío');
                }
                // Validar unicidad del texto dentro de la pregunta (excluyendo la opción actual)
                const isTextUnique = yield this.repo.isTextUniqueForQuestion(existingOption.id_pregunta, data.texto_opcion.trim(), id);
                if (!isTextUnique) {
                    throw new Error('Ya existe una opción con el mismo texto para esta pregunta');
                }
                data.texto_opcion = data.texto_opcion.trim();
            }
            // Si se está actualizando la etiqueta, validar unicidad
            if (data.etiqueta !== undefined) {
                if (typeof data.etiqueta !== 'string' || data.etiqueta.trim() === '') {
                    throw new Error('El campo etiqueta no puede estar vacío');
                }
                // Validar unicidad de la etiqueta dentro de la pregunta (excluyendo la opción actual)
                const isLabelUnique = yield this.repo.isLabelUniqueForQuestion(existingOption.id_pregunta, data.etiqueta.trim(), id);
                if (!isLabelUnique) {
                    throw new Error('Ya existe una opción con la misma etiqueta para esta pregunta');
                }
                data.etiqueta = data.etiqueta.trim();
            }
            // Si se está cambiando la pregunta asociada, validar reglas
            if (data.id_pregunta !== undefined && data.id_pregunta !== existingOption.id_pregunta) {
                // Verificar que la nueva pregunta existe
                const questionExists = yield this.repo.questionExists(data.id_pregunta);
                if (!questionExists) {
                    throw new Error('La pregunta especificada no existe');
                }
                // Obtener el tipo de la nueva pregunta para validar reglas de negocio
                const questionType = yield this.repo.getQuestionType(data.id_pregunta);
                if (!questionType) {
                    throw new Error('No se pudo determinar el tipo de la nueva pregunta');
                }
                // Validar regla: preguntas abiertas no pueden tener opciones
                if (questionType === 'abierta') {
                    throw new Error('Las preguntas de tipo "abierta" no pueden tener opciones');
                }
                // Contar opciones existentes en la nueva pregunta para validar reglas por tipo
                const currentOptionsCount = yield this.repo.countOptionsByQuestionId(data.id_pregunta);
                // Validar reglas específicas por tipo de pregunta
                if (questionType === 'boolean') {
                    if (currentOptionsCount >= 2) {
                        throw new Error('Las preguntas de tipo "boolean" pueden tener máximo 2 opciones');
                    }
                }
                // Validar unicidad del texto en la nueva pregunta
                if (data.texto_opcion || existingOption.texto_opcion) {
                    const textoToCheck = data.texto_opcion || existingOption.texto_opcion;
                    const isTextUniqueInNewQuestion = yield this.repo.isTextUniqueForQuestion(data.id_pregunta, textoToCheck);
                    if (!isTextUniqueInNewQuestion) {
                        throw new Error('Ya existe una opción con el mismo texto en la pregunta de destino');
                    }
                }
                // Validar unicidad de la etiqueta en la nueva pregunta
                if (data.etiqueta || existingOption.etiqueta) {
                    const etiquetaToCheck = data.etiqueta || existingOption.etiqueta;
                    const isLabelUniqueInNewQuestion = yield this.repo.isLabelUniqueForQuestion(data.id_pregunta, etiquetaToCheck);
                    if (!isLabelUniqueInNewQuestion) {
                        throw new Error('Ya existe una opción con la misma etiqueta en la pregunta de destino');
                    }
                }
            }
            // Actualizar la opción
            return yield this.repo.update(id, data);
        });
    }
}
exports.UpdateOpcionPregunta = UpdateOpcionPregunta;
