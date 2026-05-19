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
exports.AssignmentRepositoryMySQL = void 0;
const BaseAssignmentRepository_1 = require("./BaseAssignmentRepository");
const connection_1 = require("../../../../core/db/mysl/connection");
const uuid_1 = require("uuid");
const AssignmentRepositoryMySQL_participants_1 = require("./AssignmentRepositoryMySQL.participants");
class AssignmentRepositoryMySQL extends BaseAssignmentRepository_1.BaseAssignmentRepository {
    assignToGraduates(idEncuesta, egresados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!egresados.length)
                return { created: 0, reactivated: 0, skipped: 0 };
            // 1. Consultar los egresados ya asignados a la encuesta
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT id_egresado, is_active FROM encuesta_egresados WHERE id_encuesta = ? AND id_egresado IN (${egresados.map(() => '?').join(',')})`, [idEncuesta, ...egresados]);
            const yaAsignados = new Map();
            for (const row of rows) {
                yaAsignados.set(row.id_egresado, !!row.is_active);
            }
            let created = 0, reactivated = 0, skipped = 0;
            const inserts = [];
            const updates = [];
            for (const idEgresado of egresados) {
                if (!yaAsignados.has(idEgresado)) {
                    inserts.push(`('${(0, uuid_1.v4)()}', 1, ${idEncuesta}, ${idEgresado})`);
                    created++;
                }
                else if (!yaAsignados.get(idEgresado)) {
                    updates.push(idEgresado);
                    reactivated++;
                }
                else {
                    skipped++;
                }
            }
            // 2. Insertar nuevos
            if (inserts.length) {
                const sql = `INSERT INTO encuesta_egresados (id_encuesta_egresados, is_active, id_encuesta, id_egresado) VALUES ${inserts.join(', ')}`;
                yield connection_1.MysqlConnection.query(sql);
            }
            // 3. Reactivar los revocados
            if (updates.length) {
                const sql = `UPDATE encuesta_egresados SET is_active = 1 WHERE id_encuesta = ? AND id_egresado IN (${updates.map(() => '?').join(',')})`;
                yield connection_1.MysqlConnection.query(sql, [idEncuesta, ...updates]);
            }
            return { created, reactivated, skipped };
        });
    }
    deactivateAllAssignmentsForSurvey(idEncuesta) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE encuesta_egresados SET is_active = 0 WHERE id_encuesta = ? AND is_active = 1', [idEncuesta]);
        });
    }
    listParticipants(idEncuesta, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, AssignmentRepositoryMySQL_participants_1.listParticipantsQuery)(idEncuesta, options);
        });
    }
    revokeAccess(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE encuesta_egresados SET is_active = 0 WHERE id_encuesta_egresados = ?', [uuid]);
        });
    }
    getGroupsAssignedToSurvey(idEncuesta) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      SELECT DISTINCT
        ge.id_grupo,
        ge.nombre,
        COUNT(DISTINCT gm.id_egresado) as cantidad_participantes,
        SUM(CASE WHEN r.id_respuesta IS NOT NULL THEN 1 ELSE 0 END) as contestadas,
        SUM(CASE WHEN r.id_respuesta IS NULL THEN 1 ELSE 0 END) as pendientes
      FROM encuesta_egresados ee
      INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
      INNER JOIN grupo_miembro gm ON e.id_egresado = gm.id_egresado
      INNER JOIN grupo_egresado ge ON gm.id_grupo = ge.id_grupo
      INNER JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta
      LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario)
      WHERE ee.id_encuesta = ? AND ee.is_active = 1
      GROUP BY ge.id_grupo, ge.nombre
      ORDER BY ge.nombre ASC
    `;
            const [rows] = yield connection_1.MysqlConnection.query(sql, [idEncuesta]);
            return rows.map((row) => ({
                type: 'grupo-encuesta',
                id: row.id_grupo,
                attributes: {
                    id_grupo: row.id_grupo,
                    nombre: row.nombre,
                    cantidad_participantes: row.cantidad_participantes,
                    estado_respuesta: {
                        contestadas: row.contestadas,
                        pendientes: row.pendientes
                    }
                }
            }));
        });
    }
}
exports.AssignmentRepositoryMySQL = AssignmentRepositoryMySQL;
