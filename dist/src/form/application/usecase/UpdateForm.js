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
exports.UpdateFormulario = void 0;
class UpdateFormulario {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.repo.findById(id);
            if (!existing)
                throw new Error('El formulario no existe');
            if (data.titulo !== undefined) {
                if (typeof data.titulo !== 'string' || data.titulo.trim() === '') {
                    throw new Error('El campo titulo no puede estar vacío');
                }
                data.titulo = data.titulo.trim();
            }
            if (data.descripcion !== undefined && data.descripcion !== null) {
                if (data.descripcion.length > 500) {
                    throw new Error('La descripción no puede exceder los 500 caracteres');
                }
            }
            if (data.is_active !== undefined) {
                if (typeof data.is_active !== 'boolean') {
                    throw new Error('El campo is_active debe ser true o false explícitamente');
                }
                // si activamos y hay otro activo con mismo título
                if (data.is_active && data.titulo) {
                    const other = yield this.repo.findActiveByTitle(data.titulo);
                    if (other && other.id_formulario !== id) {
                        throw new Error('Ya existe un formulario activo con el mismo título');
                    }
                }
            }
            return yield this.repo.update(id, data);
        });
    }
}
exports.UpdateFormulario = UpdateFormulario;
