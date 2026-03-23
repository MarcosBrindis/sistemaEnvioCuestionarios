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
exports.listParticipantsQuery = listParticipantsQuery;
const connection_1 = require("../../../../core/db/mysl/connection");
function listParticipantsQuery(idEncuesta, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const offset = (options.page - 1) * options.limit;
        let where = 'ee.id_encuesta = ?';
        const params = [idEncuesta];
        if (options.filtro_acceso === 'activos') {
            where += ' AND ee.is_active = 1';
        }
        else if (options.filtro_acceso === 'revocados') {
            where += ' AND ee.is_active = 0';
        }
        if (options.estado_respuesta === 'pendiente') {
            where += ' AND r.id_respuesta IS NULL';
        }
        else if (options.estado_respuesta === 'contestada') {
            where += ' AND r.id_respuesta IS NOT NULL';
        }
        if (options.busqueda) {
            where += ' AND (e.nombre LIKE ? OR e.primer_apellido LIKE ? OR e.matricula LIKE ? OR e.email LIKE ? OR pe.nombre LIKE ?)';
            params.push(`%${options.busqueda}%`, `%${options.busqueda}%`, `%${options.busqueda}%`, `%${options.busqueda}%`, `%${options.busqueda}%`);
        }
        const sql = `SELECT 
    ee.id_encuesta_egresados as uuid,
    ee.is_active,
    e.nombre, e.primer_apellido, e.segundo_apellido, e.matricula, e.email,
    pe.nombre as programa_educativo,
    IF(r.id_respuesta IS NOT NULL, 'contestada', 'pendiente') as estado_respuesta,
    r.fecha_respuesta
  FROM encuesta_egresados ee
  INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
  LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo
  LEFT JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta
  LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario)
  WHERE ${where}
  ORDER BY e.nombre ASC
  LIMIT ? OFFSET ?`;
        params.push(options.limit, offset);
        const [rows] = yield connection_1.MysqlConnection.query(sql, params);
        // Para meta: contar total
        const [countRows] = yield connection_1.MysqlConnection.query(`SELECT COUNT(*) as total FROM encuesta_egresados ee INNER JOIN egresado e ON ee.id_egresado = e.id_egresado LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo LEFT JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario) WHERE ${where}`, params.slice(0, params.length - 2));
        return {
            meta: {
                total_records: (_b = (_a = countRows[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0,
                page: options.page,
                limit: options.limit,
            },
            data: rows.map(row => {
                var _a;
                return ({
                    type: 'participante',
                    id: row.uuid,
                    attributes: {
                        is_active: !!row.is_active,
                        estado_respuesta: row.estado_respuesta,
                        fecha_respuesta: row.fecha_respuesta,
                        egresado: {
                            nombre: row.nombre,
                            primer_apellido: row.primer_apellido,
                            segundo_apellido: row.segundo_apellido,
                            matricula: row.matricula,
                            email: row.email,
                            programa_educativo: (_a = row.programa_educativo) !== null && _a !== void 0 ? _a : null,
                        }
                    }
                });
            })
        };
    });
}
