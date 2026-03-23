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
exports.RespuestaRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class RespuestaRepositoryMySQL {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO respuesta (id_egresado, id_formulario, respuestas_json) VALUES (?, ?, ?)`, [data.id_egresado, data.id_formulario, JSON.stringify(data.respuestas_json)]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM respuesta WHERE id_respuesta = ?`, [insertId]);
            return rows[0];
        });
    }
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM respuesta`;
            const params = [];
            const conditions = [];
            if (filters === null || filters === void 0 ? void 0 : filters.id_formulario) {
                conditions.push('id_formulario = ?');
                params.push(filters.id_formulario);
            }
            if (filters === null || filters === void 0 ? void 0 : filters.id_egresado) {
                conditions.push('id_egresado = ?');
                params.push(filters.id_egresado);
            }
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
            query += ' ORDER BY fecha_respuesta DESC';
            const [rows] = yield connection_1.MysqlConnection.execute(query, params);
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM respuesta WHERE id_respuesta = ?`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM respuesta WHERE id_respuesta = ?`, [id]);
        });
    }
    existsByEgresadoAndFormulario(id_egresado, id_formulario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM respuesta WHERE id_egresado = ? AND id_formulario = ?`, [id_egresado, id_formulario]);
            return rows[0].count > 0;
        });
    }
}
exports.RespuestaRepositoryMySQL = RespuestaRepositoryMySQL;
