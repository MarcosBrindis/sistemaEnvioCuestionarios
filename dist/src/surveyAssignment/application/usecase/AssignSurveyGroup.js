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
exports.AssignSurveyGroup = void 0;
const connection_1 = require("../../../core/db/mysl/connection");
class AssignSurveyGroup {
    constructor(assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }
    execute(idEncuesta, idGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener todos los egresados del grupo
            const [rows] = yield connection_1.MysqlConnection.query('SELECT id_egresado FROM grupo_miembro WHERE id_grupo = ?', [idGroup]);
            const egresados = rows.map(r => r.id_egresado);
            if (!egresados.length)
                return { created: 0, reactivated: 0, skipped: 0 };
            return this.assignmentRepo.assignToGraduates(idEncuesta, egresados);
        });
    }
}
exports.AssignSurveyGroup = AssignSurveyGroup;
