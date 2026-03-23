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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlAnalyticsRepository = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const env_1 = require("../../../../core/db/mysl/env");
const connection_1 = require("../../../../core/db/mysl/connection");
const streamPool = mysql2_1.default.createPool({
    host: env_1.dbEnv.host,
    user: env_1.dbEnv.user,
    password: env_1.dbEnv.password,
    database: env_1.dbEnv.database,
    port: env_1.dbEnv.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
});
class MysqlAnalyticsRepository {
    getSurveyMetadata(id_encuesta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT e.id_encuesta, e.nombre, e.descripcion, COUNT(r.id_respuesta) as total_responses
       FROM encuesta e
       LEFT JOIN respuesta r ON r.id_formulario = e.id_formulario
       WHERE e.id_encuesta = ?
       GROUP BY e.id_encuesta, e.nombre, e.descripcion`, [id_encuesta]);
            if (!rows || rows.length === 0)
                return null;
            return {
                survey_id: Number(rows[0].id_encuesta),
                title: rows[0].nombre,
                description: rows[0].descripcion,
                total_responses: Number(rows[0].total_responses || 0)
            };
        });
    }
    getQuestionsWithOptions(id_encuesta) {
        return __awaiter(this, void 0, void 0, function* () {
            const [preguntas] = yield connection_1.MysqlConnection.query(`SELECT fp.id_pregunta, fp.orden, p.texto_pregunta, p.id_tipo_pregunta, tp.nombre as tipo_pregunta
       FROM formulacion_pregunta fp
       INNER JOIN encuesta e ON fp.id_formulario = e.id_formulario
       INNER JOIN pregunta p ON fp.id_pregunta = p.id_pregunta
       LEFT JOIN tipo_pregunta tp ON p.id_tipo_pregunta = tp.id_tipo_pregunta
       WHERE e.id_encuesta = ?
       ORDER BY fp.orden ASC`, [id_encuesta]);
            const results = [];
            for (const pregunta of preguntas) {
                const [opciones] = yield connection_1.MysqlConnection.query(`SELECT id_opcion_pregunta, texto_opcion, etiqueta FROM opcion_pregunta WHERE id_pregunta = ?`, [pregunta.id_pregunta]);
                results.push({
                    id_pregunta: Number(pregunta.id_pregunta),
                    texto_pregunta: pregunta.texto_pregunta,
                    tipo_pregunta: pregunta.tipo_pregunta || null,
                    opciones: (opciones || []).map((op) => ({
                        id_opcion_pregunta: Number(op.id_opcion_pregunta),
                        texto_opcion: op.texto_opcion,
                        etiqueta: op.etiqueta
                    }))
                });
            }
            return results;
        });
    }
    getResponsesStream(id_encuesta) {
        const sql = `SELECT r.respuestas_json
                 FROM respuesta r
                 INNER JOIN encuesta e ON r.id_formulario = e.id_formulario
                 WHERE e.id_encuesta = ?`;
        return streamPool.query(sql, [id_encuesta]).stream({ highWaterMark: 100 });
    }
}
exports.MysqlAnalyticsRepository = MysqlAnalyticsRepository;
