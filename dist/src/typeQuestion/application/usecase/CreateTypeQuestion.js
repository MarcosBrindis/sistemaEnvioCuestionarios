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
exports.CreateTypeQuestion = void 0;
class CreateTypeQuestion {
    constructor(repo) {
        this.repo = repo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Regla: El campo nombre es obligatorio y no puede ser nulo ni vacío
            if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim() === '') {
                throw new Error('El campo nombre es obligatorio y no puede estar vacío');
            }
            const nombreNormalizado = data.nombre.trim();
            // Regla: No se permite registrar más de un tipo de pregunta con el mismo nombre (case-insensitive)
            const existingTypeQuestion = yield this.repo.findByName(nombreNormalizado.toLowerCase());
            if (existingTypeQuestion) {
                throw new Error('Ya existe un tipo de pregunta con ese nombre');
            }
            // Crear el tipo de pregunta con el nombre normalizado
            return this.repo.create(Object.assign(Object.assign({}, data), { nombre: nombreNormalizado }));
        });
    }
}
exports.CreateTypeQuestion = CreateTypeQuestion;
