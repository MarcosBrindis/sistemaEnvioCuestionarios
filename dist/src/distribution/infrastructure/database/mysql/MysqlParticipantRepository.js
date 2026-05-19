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
exports.MysqlParticipantRepository = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class MysqlParticipantRepository {
    findBySurvey(id_encuesta, filtro) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseQuery = `
      SELECT 
          ee.id_encuesta_egresados as uuid,
          e.email,
          TRIM(CONCAT(e.nombre, ' ', e.primer_apellido, ' ', IFNULL(e.segundo_apellido, ''))) as nombre_completo
      FROM encuesta_egresados ee
      INNER JOIN encuesta enc ON ee.id_encuesta = enc.id_encuesta
      INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
      LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = enc.id_formulario)
      WHERE 
          ee.id_encuesta = ?
          AND ee.is_active = 1
          AND e.email IS NOT NULL
    `;
            let filterClause = '';
            if (filtro === 'pendientes')
                filterClause = ' AND r.id_respuesta IS NULL';
            if (filtro === 'contestadas')
                filterClause = ' AND r.id_respuesta IS NOT NULL';
            const [rows] = yield connection_1.MysqlConnection.query(baseQuery + filterClause, [id_encuesta]);
            return rows;
        });
    }
    findBirthdayCelebrants(referenceDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateValue = referenceDate.toISOString().slice(0, 10);
            const query = `
      SELECT
        CAST(e.id_egresado AS CHAR) as uuid,
        e.email,
        TRIM(CONCAT(e.nombre, ' ', e.primer_apellido, ' ', IFNULL(e.segundo_apellido, ''))) as nombre_completo
      FROM egresado e
      WHERE
        e.is_active = 1
        AND e.email IS NOT NULL
        AND TRIM(e.email) <> ''
        AND e.fecha_nacimiento IS NOT NULL
        AND MONTH(e.fecha_nacimiento) = MONTH(?)
        AND DAY(e.fecha_nacimiento) = DAY(?)
    `;
            const [rows] = yield connection_1.MysqlConnection.query(query, [dateValue, dateValue]);
            return rows;
        });
    }
    findBirthdayTestTargets(targets) {
        return __awaiter(this, void 0, void 0, function* () {
            const egresadoIds = (targets.egresadoIds || []).filter((id) => Number.isInteger(id) && id > 0);
            const emails = (targets.emails || [])
                .map((email) => String(email).trim().toLowerCase())
                .filter((email) => email.length > 0);
            if (egresadoIds.length === 0 && emails.length === 0) {
                return [];
            }
            const whereParts = [];
            const params = [];
            if (egresadoIds.length > 0) {
                whereParts.push(`e.id_egresado IN (${egresadoIds.map(() => '?').join(', ')})`);
                params.push(...egresadoIds);
            }
            if (emails.length > 0) {
                whereParts.push(`LOWER(TRIM(e.email)) IN (${emails.map(() => '?').join(', ')})`);
                params.push(...emails);
            }
            const query = `
      SELECT
        CAST(e.id_egresado AS CHAR) as uuid,
        e.email,
        TRIM(CONCAT(e.nombre, ' ', e.primer_apellido, ' ', IFNULL(e.segundo_apellido, ''))) as nombre_completo
      FROM egresado e
      WHERE
        e.is_active = 1
        AND e.email IS NOT NULL
        AND TRIM(e.email) <> ''
        AND (${whereParts.join(' OR ')})
    `;
            const [rows] = yield connection_1.MysqlConnection.query(query, params);
            return rows;
        });
    }
}
exports.MysqlParticipantRepository = MysqlParticipantRepository;
