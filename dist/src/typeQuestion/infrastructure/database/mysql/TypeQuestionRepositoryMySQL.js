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
exports.TypeQuestionRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseTypeQuestionRepository_1 = require("./BaseTypeQuestionRepository");
class TypeQuestionRepositoryMySQL extends BaseTypeQuestionRepository_1.BaseTypeQuestionRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO tipo_Pregunta (nombre) VALUES (?)`, [data.nombre]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM tipo_Pregunta WHERE id_tipo_pregunta = ?`, [insertId]);
            return rows[0];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            if (keys.length === 0) {
                // No hay campos para actualizar, no hacer nada
                return;
            }
            const fields = keys.map(key => `\`${key}\` = ?`).join(', ');
            const values = Object.values(data);
            yield connection_1.MysqlConnection.execute(`UPDATE tipo_Pregunta SET ${fields} WHERE id_tipo_pregunta = ?`, [...values, id]);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM tipo_Pregunta WHERE id_tipo_pregunta = ?`, [id]);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM tipo_Pregunta WHERE id_tipo_pregunta = ?`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM tipo_Pregunta`);
            return rows;
        });
    }
    findByName(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM tipo_Pregunta WHERE LOWER(nombre) = LOWER(?)`, [nombre]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    //mas adelante se usa
    isAssociatedWithQuestions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Asumiendo que hay una tabla 'Pregunta' que referencia a 'TipoPregunta'
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM pregunta WHERE id_tipo_pregunta = ?`, [id]);
            return rows[0].count > 0;
        });
    }
}
exports.TypeQuestionRepositoryMySQL = TypeQuestionRepositoryMySQL;
