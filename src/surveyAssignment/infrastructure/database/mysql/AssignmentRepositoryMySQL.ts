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

  async listParticipants(idEncuesta: number, options: any): Promise<{ meta: any; data: any[] }> {
    return listParticipantsQuery(idEncuesta, options);
  }

  async revokeAccess(uuid: string): Promise<void> {
    await MysqlConnection.query('UPDATE encuesta_egresados SET is_active = 0 WHERE id_encuesta_egresados = ?', [uuid]);
  }
}
