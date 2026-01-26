import mysql from 'mysql2';
import { Readable } from 'stream';
import { dbEnv } from '../../../../core/db/mysl/env';
import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { AnalyticsRepository, QuestionWithOptions } from '../../../domain/port/AnalyticsRepository';
import { SurveyMetadata } from '../../../domain/model/SurveyMetadata';

const streamPool = mysql.createPool({
  host: dbEnv.host,
  user: dbEnv.user,
  password: dbEnv.password,
  database: dbEnv.database,
  port: dbEnv.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

export class MysqlAnalyticsRepository implements AnalyticsRepository {
  async getSurveyMetadata(id_encuesta: number): Promise<SurveyMetadata | null> {
    const [rows]: any = await MysqlConnection.query(
      `SELECT e.id_encuesta, e.nombre, e.descripcion, COUNT(r.id_respuesta) as total_responses
       FROM encuesta e
       LEFT JOIN respuesta r ON r.id_formulario = e.id_formulario
       WHERE e.id_encuesta = ?
       GROUP BY e.id_encuesta, e.nombre, e.descripcion`,
      [id_encuesta]
    );

    if (!rows || rows.length === 0) return null;
    return {
      survey_id: Number(rows[0].id_encuesta),
      title: rows[0].nombre,
      description: rows[0].descripcion,
      total_responses: Number(rows[0].total_responses || 0)
    };
  }

  async getQuestionsWithOptions(id_encuesta: number): Promise<QuestionWithOptions[]> {
    const [preguntas]: any = await MysqlConnection.query(
      `SELECT fp.id_pregunta, fp.orden, p.texto_pregunta, p.id_tipo_pregunta, tp.nombre as tipo_pregunta
       FROM formulacion_pregunta fp
       INNER JOIN encuesta e ON fp.id_formulario = e.id_formulario
       INNER JOIN pregunta p ON fp.id_pregunta = p.id_pregunta
       LEFT JOIN tipo_pregunta tp ON p.id_tipo_pregunta = tp.id_tipo_pregunta
       WHERE e.id_encuesta = ?
       ORDER BY fp.orden ASC`,
      [id_encuesta]
    );

    const results: QuestionWithOptions[] = [];
    for (const pregunta of preguntas) {
      const [opciones]: any = await MysqlConnection.query(
        `SELECT id_opcion_pregunta, texto_opcion, etiqueta FROM opcion_pregunta WHERE id_pregunta = ?`,
        [pregunta.id_pregunta]
      );
      results.push({
        id_pregunta: Number(pregunta.id_pregunta),
        texto_pregunta: pregunta.texto_pregunta,
        tipo_pregunta: pregunta.tipo_pregunta || null,
        opciones: (opciones || []).map((op: any) => ({
          id_opcion_pregunta: Number(op.id_opcion_pregunta),
          texto_opcion: op.texto_opcion,
          etiqueta: op.etiqueta
        }))
      });
    }
    return results;
  }

  getResponsesStream(id_encuesta: number): Readable {
    const sql = `SELECT r.respuestas_json
                 FROM respuesta r
                 INNER JOIN encuesta e ON r.id_formulario = e.id_formulario
                 WHERE e.id_encuesta = ?`;
    return streamPool.query(sql, [id_encuesta]).stream({ highWaterMark: 100 });
  }
}
