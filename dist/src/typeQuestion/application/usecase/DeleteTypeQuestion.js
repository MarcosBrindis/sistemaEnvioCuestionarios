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
exports.DeleteTypeQuestion = void 0;
class DeleteTypeQuestion {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si el tipo de pregunta existe
            const existingTypeQuestion = yield this.repo.findById(id);
            if (!existingTypeQuestion) {
                throw new Error('El tipo de pregunta no existe');
            }
            // Regla: No se puede eliminar un tipo de pregunta si está asociado a alguna pregunta existente
            const isAssociated = yield this.repo.isAssociatedWithQuestions(id);
            if (isAssociated) {
                throw new Error('No se puede eliminar el tipo de pregunta porque está asociado a una o más preguntas');
            }
            yield this.repo.delete(id);
        });
    }
}
exports.DeleteTypeQuestion = DeleteTypeQuestion;
