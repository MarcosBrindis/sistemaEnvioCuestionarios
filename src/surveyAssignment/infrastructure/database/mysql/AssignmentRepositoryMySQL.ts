import { BaseAssignmentRepository } from './BaseAssignmentRepository';
import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { v4 as uuidv4 } from 'uuid';
import { listParticipantsQuery } from './AssignmentRepositoryMySQL.participants';

export class AssignmentRepositoryMySQL extends BaseAssignmentRepository {
  async assignToGraduates(idEncuesta: number, egresados: number[]): Promise<{ created: number; reactivated: number; skipped: number }> {
    if (!egresados.length) return { created: 0, reactivated: 0, skipped: 0 };

    // 1. Consultar los egresados ya asignados a la encuesta
    const [rows]: any = await MysqlConnection.query(
      `SELECT id_egresado, is_active FROM encuesta_egresados WHERE id_encuesta = ? AND id_egresado IN (${egresados.map(() => '?').join(',')})`,
      [idEncuesta, ...egresados]
    );
    const yaAsignados = new Map<number, boolean>();
    for (const row of rows) {
      yaAsignados.set(row.id_egresado, !!row.is_active);
    }

    let created = 0, reactivated = 0, skipped = 0;
    const inserts: string[] = [];
    const updates: number[] = [];
    for (const idEgresado of egresados) {
      if (!yaAsignados.has(idEgresado)) {
        inserts.push(`('${uuidv4()}', 1, ${idEncuesta}, ${idEgresado})`);
        created++;
      } else if (!yaAsignados.get(idEgresado)) {
        updates.push(idEgresado);
        reactivated++;
      } else {
        skipped++;
      }
    }

    // 2. Insertar nuevos
    if (inserts.length) {
      const sql = `INSERT INTO encuesta_egresados (id_encuesta_egresados, is_active, id_encuesta, id_egresado) VALUES ${inserts.join(', ')}`;
      await MysqlConnection.query(sql);
    }
    // 3. Reactivar los revocados
    if (updates.length) {
      const sql = `UPDATE encuesta_egresados SET is_active = 1 WHERE id_encuesta = ? AND id_egresado IN (${updates.map(() => '?').join(',')})`;
      await MysqlConnection.query(sql, [idEncuesta, ...updates]);
    }

    return { created, reactivated, skipped };
  }

  async deactivateAllAssignmentsForSurvey(idEncuesta: number): Promise<void> {
    await MysqlConnection.query(
      'UPDATE encuesta_egresados SET is_active = 0 WHERE id_encuesta = ? AND is_active = 1',
      [idEncuesta]
    );
  }

  async listParticipants(idEncuesta: number, options: any): Promise<{ meta: any; data: any[] }> {
    return listParticipantsQuery(idEncuesta, options);
  }

  async revokeAccess(uuid: string): Promise<void> {
    await MysqlConnection.query('UPDATE encuesta_egresados SET is_active = 0 WHERE id_encuesta_egresados = ?', [uuid]);
  }

  async getGroupsAssignedToSurvey(idEncuesta: number): Promise<any[]> {
    const sql = `
      SELECT DISTINCT
        ge.id_grupo,
        ge.nombre,
        COUNT(DISTINCT gm.id_egresado) as cantidad_participantes,
        SUM(CASE WHEN r.id_respuesta IS NOT NULL THEN 1 ELSE 0 END) as contestadas,
        SUM(CASE WHEN r.id_respuesta IS NULL THEN 1 ELSE 0 END) as pendientes
      FROM encuesta_egresados ee
      INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
      INNER JOIN grupo_miembro gm ON e.id_egresado = gm.id_egresado
      INNER JOIN grupo_egresado ge ON gm.id_grupo = ge.id_grupo
      INNER JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta
      LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario)
      WHERE ee.id_encuesta = ? AND ee.is_active = 1
      GROUP BY ge.id_grupo, ge.nombre
      ORDER BY ge.nombre ASC
    `;
    const [rows]: any = await MysqlConnection.query(sql, [idEncuesta]);
    return rows.map((row: any) => ({
      type: 'grupo-encuesta',
      id: row.id_grupo,
      attributes: {
        id_grupo: row.id_grupo,
        nombre: row.nombre,
        cantidad_participantes: row.cantidad_participantes,
        estado_respuesta: {
          contestadas: row.contestadas,
          pendientes: row.pendientes
        }
      }
    }));
  }
}
