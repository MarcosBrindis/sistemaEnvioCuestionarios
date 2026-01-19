import { ParticipantRepository, ParticipantFilter } from '../../../domain/port/ParticipantRepository';
import { Participant } from '../../../domain/model/Participant';
import { MysqlConnection } from '../../../../core/db/mysl/connection';

export class MysqlParticipantRepository implements ParticipantRepository {
  async findBySurvey(id_encuesta: number, filtro: ParticipantFilter): Promise<Participant[]> {
    const baseQuery = `
      SELECT 
          ee.id_encuesta_egresados as uuid,
          e.email,
          TRIM(CONCAT(e.nombre, ' ', e.primer_apellido, ' ', IFNULL(e.segundo_apellido, ''))) as nombre_completo
      FROM encuesta_egresados ee
      INNER JOIN encuesta enc ON ee.id_encuesta = enc.id_encuesta
      INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
      LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = enc.id_formulario)
      WHERE 
          ee.id_encuesta = ?
          AND ee.is_active = 1
          AND e.email IS NOT NULL
    `;

    let filterClause = '';
    if (filtro === 'pendientes') filterClause = ' AND r.id_respuesta IS NULL';
    if (filtro === 'contestadas') filterClause = ' AND r.id_respuesta IS NOT NULL';

    const [rows]: any = await MysqlConnection.query(baseQuery + filterClause, [id_encuesta]);
    return rows as Participant[];
  }
}
