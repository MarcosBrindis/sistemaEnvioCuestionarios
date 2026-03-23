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
exports.UpdateTypeQuestion = void 0;
class UpdateTypeQuestion {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si el tipo de pregunta existe
            const existingTypeQuestion = yield this.repo.findById(id);
            if (!existingTypeQuestion) {
                throw new Error('El tipo de pregunta no existe');
            }
            // Si se está actualizando el nombre, validar reglas de negocio
            if (data.nombre) {
                // Regla: El campo nombre no puede ser nulo ni vacío
                if (typeof data.nombre !== 'string' || data.nombre.trim() === '') {
                    throw new Error('El campo nombre no puede estar vacío');
                }
                const nombreNormalizado = data.nombre.trim();
                // Regla: No se permite registrar más de un tipo de pregunta con el mismo nombre (case-insensitive)
                const duplicateTypeQuestion = yield this.repo.findByName(nombreNormalizado.toLowerCase());
                if (duplicateTypeQuestion && duplicateTypeQuestion.id_tipo_pregunta !== id) {
                    throw new Error('Ya existe un tipo de pregunta con ese nombre');
                }
                // Normalizar el nombre
                data.nombre = nombreNormalizado;
            }
            yield this.repo.update(id, data);
            // Retornar el tipo de pregunta actualizado
            const updatedTypeQuestion = yield this.repo.findById(id);
            return updatedTypeQuestion; // Ya verificamos que existe al inicio
        });
    }
}
exports.UpdateTypeQuestion = UpdateTypeQuestion;
