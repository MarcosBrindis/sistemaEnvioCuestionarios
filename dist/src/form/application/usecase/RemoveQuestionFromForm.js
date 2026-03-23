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
exports.RemoveQuestionFromFormulario = void 0;
class RemoveQuestionFromFormulario {
    constructor(repo) {
        this.repo = repo;
    }
    execute(formularioId, preguntaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const formulario = yield this.repo.findById(formularioId);
            if (!formulario)
                throw new Error('El formulario especificado no existe');
            const associated = yield this.repo.isQuestionAssociated(formularioId, preguntaId);
            if (!associated)
                throw new Error('La pregunta no está asociada a este formulario');
            // Eliminar
            yield this.repo.removeQuestion(formularioId, preguntaId);
            // Opcional: reordenar los ordenes para mantener consecutividad
            // Implementación en repository: renumerar los ordenes después de borrar
        });
    }
}
exports.RemoveQuestionFromFormulario = RemoveQuestionFromFormulario;
