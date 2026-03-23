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
exports.OpcionPreguntaRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseOpcionPreguntaRepository_1 = require("./BaseOpcionPreguntaRepository");
class OpcionPreguntaRepositoryMySQL extends BaseOpcionPreguntaRepository_1.BaseOpcionPreguntaRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO opcion_pregunta (texto_opcion, etiqueta, id_pregunta) VALUES (?, ?, ?)`, [data.texto_opcion, data.etiqueta, data.id_pregunta]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM opcion_pregunta WHERE id_opcion_pregunta = ?`, [insertId]);
            return rows[0];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            if (keys.length === 0) {
                // No hay campos para actualizar, retornar la opción actual
                const option = yield this.findById(id);
                return option;
            }
            const fields = keys.map(key => `\`${key}\` = ?`).join(', ');
            const values = Object.values(data);
            yield connection_1.MysqlConnection.execute(`UPDATE opcion_pregunta SET ${fields} WHERE id_opcion_pregunta = ?`, [...values, id]);
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM opcion_pregunta WHERE id_opcion_pregunta = ?`, [id]);
            return rows[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM opcion_pregunta WHERE id_opcion_pregunta = ?`, [id]);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM opcion_pregunta WHERE id_opcion_pregunta = ?`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM opcion_pregunta ORDER BY id_opcion_pregunta ASC`);
            return rows;
        });
    }
    findByQuestionId(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM opcion_pregunta WHERE id_pregunta = ? ORDER BY id_opcion_pregunta ASC`, [idPregunta]);
            return rows;
        });
    }
    // Métodos para validaciones de negocio
    isTextUniqueForQuestion(idPregunta, textoOpcion, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT COUNT(*) as count FROM opcion_pregunta 
                 WHERE id_pregunta = ? AND UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(texto_opcion, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) = 
                       UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'))`;
            let params = [idPregunta, textoOpcion];
            if (excludeId !== undefined) {
                query += ` AND id_opcion_pregunta != ?`;
                params.push(excludeId);
            }
            const [rows] = yield connection_1.MysqlConnection.execute(query, params);
            return rows[0].count === 0;
        });
    }
    isLabelUniqueForQuestion(idPregunta, etiqueta, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT COUNT(*) as count FROM opcion_pregunta 
                 WHERE id_pregunta = ? AND UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(etiqueta, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) = 
                       UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'))`;
            let params = [idPregunta, etiqueta];
            if (excludeId !== undefined) {
                query += ` AND id_opcion_pregunta != ?`;
                params.push(excludeId);
            }
            const [rows] = yield connection_1.MysqlConnection.execute(query, params);
            return rows[0].count === 0;
        });
    }
    questionExists(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM pregunta WHERE id_pregunta = ?`, [idPregunta]);
            return rows[0].count > 0;
        });
    }
    getQuestionType(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT tp.nombre 
       FROM pregunta p 
       INNER JOIN tipo_pregunta tp ON p.id_tipo_pregunta = tp.id_tipo_pregunta 
       WHERE p.id_pregunta = ?`, [idPregunta]);
            return rows.length > 0 ? rows[0].nombre : null;
        });
    }
    countOptionsByQuestionId(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM opcion_pregunta WHERE id_pregunta = ?`, [idPregunta]);
            return rows[0].count;
        });
    }
}
exports.OpcionPreguntaRepositoryMySQL = OpcionPreguntaRepositoryMySQL;
