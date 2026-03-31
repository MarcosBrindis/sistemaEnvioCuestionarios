import {
  BirthdayTestTargets,
  ParticipantRepository,
  ParticipantFilter
} from '../../../domain/port/ParticipantRepository';
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

  async findBirthdayCelebrants(referenceDate: Date): Promise<Participant[]> {
    const dateValue = referenceDate.toISOString().slice(0, 10);
    const query = `
      SELECT
        CAST(e.id_egresado AS CHAR) as uuid,
        e.email,
        TRIM(CONCAT(e.nombre, ' ', e.primer_apellido, ' ', IFNULL(e.segundo_apellido, ''))) as nombre_completo
      FROM egresado e
      WHERE
        e.is_active = 1
        AND e.email IS NOT NULL
        AND TRIM(e.email) <> ''
        AND e.fecha_nacimiento IS NOT NULL
        AND MONTH(e.fecha_nacimiento) = MONTH(?)
        AND DAY(e.fecha_nacimiento) = DAY(?)
    `;

    const [rows]: any = await MysqlConnection.query(query, [dateValue, dateValue]);
    return rows as Participant[];
  }

  async findBirthdayTestTargets(targets: BirthdayTestTargets): Promise<Participant[]> {
    const egresadoIds = (targets.egresadoIds || []).filter((id) => Number.isInteger(id) && id > 0);
    const emails = (targets.emails || [])
      .map((email) => String(email).trim().toLowerCase())
      .filter((email) => email.length > 0);

    if (egresadoIds.length === 0 && emails.length === 0) {
      return [];
    }

    const whereParts: string[] = [];
    const params: Array<number | string> = [];

    if (egresadoIds.length > 0) {
      whereParts.push(`e.id_egresado IN (${egresadoIds.map(() => '?').join(', ')})`);
      params.push(...egresadoIds);
    }

    if (emails.length > 0) {
      whereParts.push(`LOWER(TRIM(e.email)) IN (${emails.map(() => '?').join(', ')})`);
      params.push(...emails);
    }

    const query = `
      SELECT
        CAST(e.id_egresado AS CHAR) as uuid,
        e.email,
        TRIM(CONCAT(e.nombre, ' ', e.primer_apellido, ' ', IFNULL(e.segundo_apellido, ''))) as nombre_completo
      FROM egresado e
      WHERE
        e.is_active = 1
        AND e.email IS NOT NULL
        AND TRIM(e.email) <> ''
        AND (${whereParts.join(' OR ')})
    `;

    const [rows]: any = await MysqlConnection.query(query, params);
    return rows as Participant[];
  }
}
