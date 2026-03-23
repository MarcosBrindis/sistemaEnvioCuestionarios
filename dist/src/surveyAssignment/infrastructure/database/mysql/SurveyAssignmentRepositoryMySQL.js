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
exports.SurveyAssignmentRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class SurveyAssignmentRepositoryMySQL {
    findByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT
        ee.id_encuesta_egresados,
        ee.is_active,
        ee.id_egresado,
        enc.id_encuesta,
        enc.id_formulario,
        enc.nombre,
        enc.descripcion,
        f.titulo
      FROM encuesta_egresados ee
      INNER JOIN encuesta enc ON enc.id_encuesta = ee.id_encuesta
      INNER JOIN formulario f ON f.id_formulario = enc.id_formulario
      WHERE ee.id_encuesta_egresados = ?
      LIMIT 1`, [uuid]);
            if (!rows[0])
                return null;
            const row = rows[0];
            return {
                id_encuesta_egresados: row.id_encuesta_egresados,
                is_active: !!row.is_active,
                id_egresado: row.id_egresado,
                id_encuesta: row.id_encuesta,
                id_formulario: row.id_formulario,
                nombre_encuesta: row.nombre,
                descripcion_encuesta: (_a = row.descripcion) !== null && _a !== void 0 ? _a : null,
                titulo_formulario: (_b = row.titulo) !== null && _b !== void 0 ? _b : null
            };
        });
    }
}
exports.SurveyAssignmentRepositoryMySQL = SurveyAssignmentRepositoryMySQL;
