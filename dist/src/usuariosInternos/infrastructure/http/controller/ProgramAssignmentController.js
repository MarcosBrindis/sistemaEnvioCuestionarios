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
exports.ProgramAssignmentController = void 0;
class ProgramAssignmentController {
    constructor(assignPrograms, getUserPrograms, removeUserProgram) {
        this.assignPrograms = assignPrograms;
        this.getUserPrograms = getUserPrograms;
        this.removeUserProgram = removeUserProgram;
    }
    assignProgramsHandle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const id_usuario = parseInt(id);
                if (isNaN(id_usuario)) {
                    res.status(400).json({
                        success: false,
                        error: 'ID de usuario inválido',
                    });
                    return;
                }
                const { id_programas } = req.body;
                if (!Array.isArray(id_programas)) {
                    res.status(400).json({
                        success: false,
                        error: 'id_programas debe ser un array',
                    });
                    return;
                }
                if (id_programas.length !== 1) {
                    res.status(400).json({
                        success: false,
                        error: 'Un director de programa educativo solo puede tener un programa asignado',
                    });
                    return;
                }
                const result = yield this.assignPrograms.execute(id_usuario, id_programas);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.json({
                    success: true,
                    message: 'Programas asignados correctamente',
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
    getProgramsHandle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const id_usuario = parseInt(id);
                if (isNaN(id_usuario)) {
                    res.status(400).json({
                        success: false,
                        error: 'ID de usuario inválido',
                    });
                    return;
                }
                const result = yield this.getUserPrograms.execute(id_usuario);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.json({
                    success: true,
                    data: result.data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
    removeProgramHandle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, idPrograma } = req.params;
                const id_usuario = parseInt(id);
                const id_programa = parseInt(idPrograma);
                if (isNaN(id_usuario) || isNaN(id_programa)) {
                    res.status(400).json({
                        success: false,
                        error: 'IDs inválidos',
                    });
                    return;
                }
                const result = yield this.removeUserProgram.execute(id_usuario, id_programa);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.json({
                    success: true,
                    message: 'Programa removido correctamente',
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        });
    }
}
exports.ProgramAssignmentController = ProgramAssignmentController;
