import { MysqlConnection } from '../../../core/db/mysl/connection';
import { FormularioRepository } from '../../../form/domain/port/formRepository';

export class GetPublicSurveyByUuid {
  constructor(private formularioRepository: FormularioRepository) {}

  async execute(uuid: string): Promise<{
    uuid: string;
    access_active: boolean;
    survey: {
      id_encuesta: number;
      nombre: string;
      descripcion: string | null;
      is_active: boolean;
    };
    form: {
      id_formulario: number;
      titulo: string | null;
      descripcion: string | null;
      is_active: boolean;
    };
    questions: any[];
  } | null> {
    const [rows]: [any[], any] = await MysqlConnection.query(
      `SELECT
        ee.id_encuesta_egresados AS uuid,
        ee.is_active AS access_active,
        enc.id_encuesta,
        enc.nombre,
        enc.descripcion,
        enc.is_active AS encuesta_activa,
        enc.id_formulario,
        f.titulo,
        f.descripcion AS form_descripcion,
        f.is_active AS form_activa
      FROM encuesta_egresados ee
      INNER JOIN encuesta enc ON enc.id_encuesta = ee.id_encuesta
      INNER JOIN formulario f ON f.id_formulario = enc.id_formulario
      WHERE ee.id_encuesta_egresados = ?
      LIMIT 1`,
      [uuid]
    );

    if (!rows[0]) return null;

    const row = rows[0];
    const questions = await this.formularioRepository.getQuestionsWithOptionsByFormId(row.id_formulario);

    return {
      uuid: row.uuid,
      access_active: !!row.access_active,
      survey: {
        id_encuesta: row.id_encuesta,
        nombre: row.nombre,
        descripcion: row.descripcion ?? null,
        is_active: !!row.encuesta_activa
      },
      form: {
        id_formulario: row.id_formulario,
        titulo: row.titulo ?? null,
        descripcion: row.form_descripcion ?? null,
        is_active: !!row.form_activa
      },
      questions
    };
  }
}
