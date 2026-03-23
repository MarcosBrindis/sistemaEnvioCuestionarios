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
exports.AssignProgramsToDirector = void 0;
class AssignProgramsToDirector {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id_usuario, id_programas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id_programas.length === 0) {
                    return {
                        success: false,
                        error: 'Debe asignar al menos un programa',
                    };
                }
                if (id_programas.length !== 1) {
                    return {
                        success: false,
                        error: 'Un director de programa educativo solo puede tener un programa asignado',
                    };
                }
                const assigned = yield this.repository.assignPrograms(id_usuario, id_programas);
                if (!assigned) {
                    return {
                        success: false,
                        error: 'No se pudo asignar los programas',
                    };
                }
                return {
                    success: true,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                };
            }
        });
    }
}
exports.AssignProgramsToDirector = AssignProgramsToDirector;
