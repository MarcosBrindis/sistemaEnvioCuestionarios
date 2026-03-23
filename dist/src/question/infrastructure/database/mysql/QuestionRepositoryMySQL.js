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
exports.QuestionRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseQuestionRepository_1 = require("./BaseQuestionRepository");
class QuestionRepositoryMySQL extends BaseQuestionRepository_1.BaseQuestionRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO pregunta (texto_pregunta, es_obligatoria, id_tipo_pregunta) VALUES (?, ?, ?)`, [data.texto_pregunta, data.es_obligatoria, data.id_tipo_pregunta]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM pregunta WHERE id_pregunta = ?`, [insertId]);
            return rows[0];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            if (keys.length === 0) {
                // No hay campos para actualizar, retornar la pregunta actual
                const question = yield this.findById(id);
                return question;
            }
            const fields = keys.map(key => `\`${key}\` = ?`).join(', ');
            const values = Object.values(data);
            yield connection_1.MysqlConnection.execute(`UPDATE pregunta SET ${fields} WHERE id_pregunta = ?`, [...values, id]);
            // Retornar la pregunta actualizada
            const updatedQuestion = yield this.findById(id);
            return updatedQuestion;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM pregunta WHERE id_pregunta = ?`, [id]);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM pregunta WHERE id_pregunta = ?`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM pregunta`);
            return rows;
        });
    }
    findByTypeQuestionId(idTipoPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM pregunta WHERE id_tipo_pregunta = ?`, [idTipoPregunta]);
            return rows;
        });
    }
    searchByText(texto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Búsqueda case-insensitive y sin acentos usando UPPER y REPLACE
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM pregunta 
       WHERE UPPER(
         REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
           REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
             REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(texto_pregunta, 
             'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u'), 
             'Á','A'), 'É','E'), 'Í','I'), 'Ó','O'), 'Ú','U'),
             'ñ','n'), 'Ñ','N'), 'ü','u'), 'Ü','U'), 'ç','c')
       ) LIKE UPPER(
         REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
           REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
             REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 
             'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u'), 
             'Á','A'), 'É','E'), 'Í','I'), 'Ó','O'), 'Ú','U'),
             'ñ','n'), 'Ñ','N'), 'ü','u'), 'Ü','U'), 'ç','c')
       )`, [`%${texto}%`]);
            return rows;
        });
    }
    typeQuestionExists(idTipoPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM tipo_pregunta WHERE id_tipo_pregunta = ?`, [idTipoPregunta]);
            return rows[0].count > 0;
        });
    }
    getTypeQuestionName(idTipoPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT nombre FROM tipo_pregunta WHERE id_tipo_pregunta = ?`, [idTipoPregunta]);
            return rows.length > 0 ? rows[0].nombre : null;
        });
    }
    countOptionsByQuestionId(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM opcion_pregunta WHERE id_pregunta = ?`, [idPregunta]);
            return rows[0].count;
        });
    }
    hasLikertOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM opcion_pregunta WHERE etiqueta LIKE 'likert-%'`);
            return rows[0].count > 0;
        });
    }
    getQuestionWithOptions(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener la pregunta
            const question = yield this.findById(idPregunta);
            if (!question) {
                return null;
            }
            // Obtener el nombre del tipo de pregunta
            const tipoNombre = yield this.getTypeQuestionName(question.id_tipo_pregunta);
            // Obtener las opciones asociadas a la pregunta
            const [options] = yield connection_1.MysqlConnection.execute(`SELECT id_opcion_pregunta, texto_opcion, etiqueta 
       FROM opcion_pregunta 
       WHERE id_pregunta = ? 
       ORDER BY etiqueta`, [idPregunta]);
            return Object.assign(Object.assign({}, question), { tipo_pregunta_nombre: tipoNombre, opciones: options });
        });
    }
    getAllQuestionsWithOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            // Consulta con JOIN para obtener todas las preguntas con sus opciones
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT 
        p.id_pregunta,
        p.texto_pregunta,
        p.es_obligatoria,
        p.id_tipo_pregunta,
        tp.nombre as tipo_pregunta_nombre,
        op.id_opcion_pregunta,
        op.texto_opcion,
        op.etiqueta
      FROM pregunta p
      INNER JOIN tipo_pregunta tp ON p.id_tipo_pregunta = tp.id_tipo_pregunta
      LEFT JOIN opcion_pregunta op ON p.id_pregunta = op.id_pregunta
      ORDER BY p.id_pregunta, op.etiqueta`);
            // Agrupar opciones por pregunta
            const questionsMap = new Map();
            rows.forEach((row) => {
                const questionId = row.id_pregunta;
                if (!questionsMap.has(questionId)) {
                    questionsMap.set(questionId, {
                        id_pregunta: row.id_pregunta,
                        texto_pregunta: row.texto_pregunta,
                        es_obligatoria: row.es_obligatoria,
                        id_tipo_pregunta: row.id_tipo_pregunta,
                        tipo_pregunta_nombre: row.tipo_pregunta_nombre,
                        opciones: []
                    });
                }
                // Agregar opción si existe
                if (row.id_opcion_pregunta) {
                    questionsMap.get(questionId).opciones.push({
                        id_opcion_pregunta: row.id_opcion_pregunta,
                        texto_opcion: row.texto_opcion,
                        etiqueta: row.etiqueta
                    });
                }
            });
            return Array.from(questionsMap.values());
        });
    }
    getLikertOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT id_opcion_pregunta, texto_opcion, etiqueta 
       FROM opcion_pregunta 
       WHERE etiqueta LIKE 'likert-%' 
       ORDER BY etiqueta`);
            return rows;
        });
    }
}
exports.QuestionRepositoryMySQL = QuestionRepositoryMySQL;
