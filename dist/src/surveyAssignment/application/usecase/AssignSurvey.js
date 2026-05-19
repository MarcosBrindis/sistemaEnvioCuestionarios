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
exports.AssignSurvey = void 0;
class AssignSurvey {
    constructor(assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }
    execute(idEncuesta, egresados) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mantener historial, pero asegurar que solo los miembros recién asignados queden activos
            yield this.assignmentRepo.deactivateAllAssignmentsForSurvey(idEncuesta);
            return this.assignmentRepo.assignToGraduates(idEncuesta, egresados);
        });
    }
}
exports.AssignSurvey = AssignSurvey;
