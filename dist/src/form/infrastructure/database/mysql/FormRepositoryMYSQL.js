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
exports.FormularioRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class FormularioRepositoryMySQL {
    getQuestionsWithOptionsByFormId(formularioId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener preguntas asociadas al formulario y su orden
            const [preguntas] = yield connection_1.MysqlConnection.execute(`SELECT fp.id_pregunta, fp.orden, p.texto_pregunta, p.es_obligatoria, p.id_tipo_pregunta
       FROM formulacion_pregunta fp
       JOIN pregunta p ON fp.id_pregunta = p.id_pregunta
       WHERE fp.id_formulario = ?
       ORDER BY fp.orden ASC`, [formularioId]);
            // 2. Para cada pregunta, obtener tipo y opciones
            const results = [];
            for (const pregunta of preguntas) {
                // Obtener tipo de pregunta
                const [tipoRows] = yield connection_1.MysqlConnection.execute(`SELECT id_tipo_pregunta, nombre FROM tipo_pregunta WHERE id_tipo_pregunta = ?`, [pregunta.id_tipo_pregunta]);
                const tipoPregunta = tipoRows[0] || { id_tipo_pregunta: pregunta.id_tipo_pregunta, nombre: null };
                // Obtener opciones
                const [opciones] = yield connection_1.MysqlConnection.execute(`SELECT id_opcion_pregunta, texto_opcion, etiqueta FROM opcion_pregunta WHERE id_pregunta = ?`, [pregunta.id_pregunta]);
                results.push({
                    id: pregunta.id_pregunta,
                    texto_pregunta: pregunta.texto_pregunta,
                    es_obligatoria: pregunta.es_obligatoria,
                    orden_en_formulario: pregunta.orden,
                    tipo_pregunta: {
                        id: tipoPregunta.id_tipo_pregunta,
                        nombre: tipoPregunta.nombre
                    },
                    opciones: opciones.map((op) => ({
                        id: op.id_opcion_pregunta,
                        texto_opcion: op.texto_opcion,
                        etiqueta: op.etiqueta
                    }))
                });
            }
            return results;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO formulario (titulo, descripcion, fecha_creacion, is_active) VALUES (?, ?, NOW(), ?)`, [data.titulo, data.descripcion, data.is_active]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM formulario WHERE id_formulario = ?`, [insertId]);
            return rows[0];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            if (keys.length === 0) {
                const f = yield this.findById(id);
                return f;
            }
            const fields = keys.map(k => `\`${k}\` = ?`).join(', ');
            const values = Object.values(data);
            yield connection_1.MysqlConnection.execute(`UPDATE formulario SET ${fields} WHERE id_formulario = ?`, [...values, id]);
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM formulario WHERE id_formulario = ?`, [id]);
            return rows[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM formulario WHERE id_formulario = ?`, [id]);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM formulario WHERE id_formulario = ?`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM formulario ORDER BY id_formulario ASC`);
            return rows;
        });
    }
    findActiveByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM formulario WHERE is_active = true AND UPPER(titulo) = UPPER(?)`, [title]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    // pivot: formulacion_pregunta
    addQuestion(formularioId, preguntaId, orden) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`INSERT INTO formulacion_pregunta (id_formulario, id_pregunta, orden) VALUES (?, ?, ?)`, [formularioId, preguntaId, orden]);
        });
    }
    removeQuestion(formularioId, preguntaId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM formulacion_pregunta WHERE id_formulario = ? AND id_pregunta = ?`, [formularioId, preguntaId]);
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT id_pregunta FROM formulacion_pregunta WHERE id_formulario = ? ORDER BY orden ASC`, [formularioId]);
            let order = 1;
            for (const r of rows) {
                yield connection_1.MysqlConnection.execute(`UPDATE formulacion_pregunta SET orden = ? WHERE id_formulario = ? AND id_pregunta = ?`, [order, formularioId, r.id_pregunta]);
                order++;
            }
        });
    }
    isQuestionAssociated(formularioId, preguntaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM formulacion_pregunta WHERE id_formulario = ? AND id_pregunta = ?`, [formularioId, preguntaId]);
            return rows[0].count > 0;
        });
    }
    getQuestionsByForm(formularioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT id_pregunta, orden FROM formulacion_pregunta WHERE id_formulario = ? ORDER BY orden ASC`, [formularioId]);
            return rows;
        });
    }
    countFormsByQuestionId(preguntaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(DISTINCT id_formulario) as count FROM formulacion_pregunta WHERE id_pregunta = ?`, [preguntaId]);
            return rows[0].count;
        });
    }
    hasDuplicateOrder(formularioId, orden) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM formulacion_pregunta WHERE id_formulario = ? AND orden = ?`, [formularioId, orden]);
            return rows[0].count > 0;
        });
    }
    getMaxOrder(formularioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT MAX(orden) as maxOrder FROM formulacion_pregunta WHERE id_formulario = ?`, [formularioId]);
            const v = rows[0].maxOrder;
            return v === null ? null : Number(v);
        });
    }
    formHasEncuestaActive(formularioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM encuesta WHERE id_formulario = ? AND is_active = true`, [formularioId]);
            return rows[0].count > 0;
        });
    }
    preguntaExists(preguntaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM pregunta WHERE id_pregunta = ?`, [preguntaId]);
            return rows[0].count > 0;
        });
    }
    getQuestionsFormattedForPublic(formularioId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Obtener preguntas asociadas al formulario
            const [preguntas] = yield connection_1.MysqlConnection.execute(`SELECT fp.id_pregunta, fp.orden, p.texto_pregunta, p.es_obligatoria, p.id_tipo_pregunta
       FROM formulacion_pregunta fp
       JOIN pregunta p ON fp.id_pregunta = p.id_pregunta
       WHERE fp.id_formulario = ?
       ORDER BY fp.orden ASC`, [formularioId]);
            const preguntasFormateadas = [];
            for (const pregunta of preguntas) {
                // Obtener tipo de pregunta
                const [tipoRows] = yield connection_1.MysqlConnection.execute(`SELECT nombre FROM tipo_pregunta WHERE id_tipo_pregunta = ?`, [pregunta.id_tipo_pregunta]);
                const tipo = ((_a = tipoRows[0]) === null || _a === void 0 ? void 0 : _a.nombre) || 'desconocido';
                // Obtener opciones
                const [opciones] = yield connection_1.MysqlConnection.execute(`SELECT id_opcion_pregunta, texto_opcion FROM opcion_pregunta WHERE id_pregunta = ? ORDER BY id_opcion_pregunta ASC`, [pregunta.id_pregunta]);
                preguntasFormateadas.push({
                    id: pregunta.id_pregunta.toString(),
                    tipo: tipo,
                    texto: pregunta.texto_pregunta,
                    es_obligatoria: !!pregunta.es_obligatoria,
                    orden: pregunta.orden,
                    opciones: opciones.map((op) => ({
                        id: op.id_opcion_pregunta.toString(),
                        valor: op.texto_opcion
                    }))
                });
            }
            return preguntasFormateadas;
        });
    }
}
exports.FormularioRepositoryMySQL = FormularioRepositoryMySQL;
