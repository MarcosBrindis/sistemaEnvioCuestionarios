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
exports.CreateOpcionPregunta = void 0;
class CreateOpcionPregunta {
    constructor(repo) {
        this.repo = repo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones básicas de la opción
            if (!data.texto_opcion || typeof data.texto_opcion !== 'string' || data.texto_opcion.trim() === '') {
                throw new Error('El campo texto_opcion es obligatorio y no puede estar vacío');
            }
            if (!data.etiqueta || typeof data.etiqueta !== 'string' || data.etiqueta.trim() === '') {
                throw new Error('El campo etiqueta es obligatorio y no puede estar vacío');
            }
            if (!data.id_pregunta || typeof data.id_pregunta !== 'number') {
                throw new Error('El campo id_pregunta es obligatorio');
            }
            // Verificar que la pregunta existe
            const questionExists = yield this.repo.questionExists(data.id_pregunta);
            if (!questionExists) {
                throw new Error('La pregunta especificada no existe');
            }
            // Obtener el tipo de la pregunta para validar reglas de negocio
            const questionType = yield this.repo.getQuestionType(data.id_pregunta);
            if (!questionType) {
                throw new Error('No se pudo determinar el tipo de la pregunta');
            }
            // Validar regla: preguntas abiertas no pueden tener opciones
            if (questionType === 'abierta') {
                throw new Error('Las preguntas de tipo "abierta" no pueden tener opciones');
            }
            // Validar unicidad del texto dentro de la pregunta
            const isTextUnique = yield this.repo.isTextUniqueForQuestion(data.id_pregunta, data.texto_opcion.trim());
            if (!isTextUnique) {
                throw new Error('Ya existe una opción con el mismo texto para esta pregunta');
            }
            // Validar unicidad de la etiqueta dentro de la pregunta
            const isLabelUnique = yield this.repo.isLabelUniqueForQuestion(data.id_pregunta, data.etiqueta.trim());
            if (!isLabelUnique) {
                throw new Error('Ya existe una opción con la misma etiqueta para esta pregunta');
            }
            // Contar opciones existentes para validar reglas por tipo
            const currentOptionsCount = yield this.repo.countOptionsByQuestionId(data.id_pregunta);
            // Validar reglas específicas por tipo de pregunta
            if (questionType === 'boolean') {
                if (currentOptionsCount >= 2) {
                    throw new Error('Las preguntas de tipo "boolean" pueden tener máximo 2 opciones');
                }
            }
            // Crear la opción
            const normalizedData = Object.assign(Object.assign({}, data), { texto_opcion: data.texto_opcion.trim(), etiqueta: data.etiqueta.trim() });
            const createdOption = yield this.repo.create(normalizedData);
            return createdOption;
        });
    }
}
exports.CreateOpcionPregunta = CreateOpcionPregunta;
