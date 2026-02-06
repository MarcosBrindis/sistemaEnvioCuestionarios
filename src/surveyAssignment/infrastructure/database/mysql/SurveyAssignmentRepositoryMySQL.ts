import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { SurveyAssignmentRepository } from '../../../domain/port/surveyAssignmentRepository';

export class SurveyAssignmentRepositoryMySQL implements SurveyAssignmentRepository {
  async findByUuid(uuid: string): Promise<{
    id_encuesta_egresados: string;
    is_active: boolean;
    id_egresado: number;
    id_encuesta: number;
    id_formulario: number;
    nombre_encuesta: string;
    descripcion_encuesta: string | null;
    titulo_formulario: string | null;
  } | null> {
    const [rows]: [any[], any] = await MysqlConnection.query(
      `SELECT
        ee.id_encuesta_egresados,
        ee.is_active,
        ee.id_egresado,
        enc.id_encuesta,
        enc.id_formulario,
        enc.nombre,
        enc.descripcion,
        f.titulo
      FROM encuesta_egresados ee
      INNER JOIN encuesta enc ON enc.id_encuesta = ee.id_encuesta
      INNER JOIN formulario f ON f.id_formulario = enc.id_formulario
      WHERE ee.id_encuesta_egresados = ?
      LIMIT 1`,
      [uuid]
    );

    if (!rows[0]) return null;

    const row = rows[0];
    return {
      id_encuesta_egresados: row.id_encuesta_egresados,
      is_active: !!row.is_active,
      id_egresado: row.id_egresado,
      id_encuesta: row.id_encuesta,
      id_formulario: row.id_formulario,
      nombre_encuesta: row.nombre,
      descripcion_encuesta: row.descripcion ?? null,
      titulo_formulario: row.titulo ?? null
    };
  }
}
