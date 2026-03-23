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
exports.CreateFormulario = void 0;
class CreateFormulario {
    constructor(repo) {
        this.repo = repo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Validaciones
            if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim() === '') {
                throw new Error('El campo titulo es obligatorio y no puede estar vacío');
            }
            const titulo = data.titulo.trim();
            if (data.descripcion && data.descripcion.length > 500) {
                throw new Error('La descripción no puede exceder los 500 caracteres');
            }
            if (typeof data.is_active !== 'boolean') {
                throw new Error('El campo is_active debe ser true o false explícitamente');
            }
            // No se deben registrar dos formularios activos con el mismo título
            if (data.is_active) {
                const existing = yield this.repo.findActiveByTitle(titulo);
                if (existing) {
                    throw new Error('Ya existe un formulario activo con el mismo título');
                }
            }
            const normalized = {
                titulo,
                descripcion: (_a = data.descripcion) !== null && _a !== void 0 ? _a : null,
                is_active: data.is_active
            };
            const created = yield this.repo.create(normalized);
            return created;
        });
    }
}
exports.CreateFormulario = CreateFormulario;
