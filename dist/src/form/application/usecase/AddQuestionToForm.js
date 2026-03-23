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
exports.AddQuestionToFormulario = void 0;
class AddQuestionToFormulario {
    constructor(repo) {
        this.repo = repo;
    }
    execute(formularioId, preguntaId, orden) {
        return __awaiter(this, void 0, void 0, function* () {
            const formulario = yield this.repo.findById(formularioId);
            if (!formulario)
                throw new Error('El formulario especificado no existe');
            const preguntaExists = yield this.repo.preguntaExists(preguntaId);
            if (!preguntaExists)
                throw new Error('La pregunta especificada no existe');
            if (!Number.isInteger(orden) || orden <= 0) {
                throw new Error('El campo orden debe ser un número entero mayor que 0');
            }
            // No permitir misma pregunta más de una vez en el mismo formulario
            const associated = yield this.repo.isQuestionAssociated(formularioId, preguntaId);
            if (associated)
                throw new Error('La pregunta ya está asociada a este formulario');
            // No permitir orden duplicado dentro del mismo formulario
            const duplicateOrder = yield this.repo.hasDuplicateOrder(formularioId, orden);
            if (duplicateOrder)
                throw new Error('Ya existe una pregunta con el mismo orden en este formulario');
            const maxOrder = yield this.repo.getMaxOrder(formularioId);
            const expected = (maxOrder !== null && maxOrder !== void 0 ? maxOrder : 0) + 1;
            if (orden !== expected) {
                throw new Error(`El orden debe ser consecutivo. El siguiente orden disponible es ${expected}`);
            }
            yield this.repo.addQuestion(formularioId, preguntaId, orden);
        });
    }
}
exports.AddQuestionToFormulario = AddQuestionToFormulario;
