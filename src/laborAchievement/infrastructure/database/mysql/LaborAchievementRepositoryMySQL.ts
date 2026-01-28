import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { LaborAchievement } from '../../../domain/model/laborAchievement';
import { LaborAchievementRepository } from '../../../domain/port/laborAchievementRepository';

export class LaborAchievementRepositoryMySQL implements LaborAchievementRepository {
  async create(idEgresado: number, data: Omit<LaborAchievement, 'id_labor_achievement'>): Promise<LaborAchievement> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO logro_laboral (empresa, puesto, fecha) VALUES (?, ?, ?)`,
      [data.company, data.position, data.date || null]
    );
    const insertId = result.insertId || (result[0] && result[0].insertId);
    await MysqlConnection.execute(
      `INSERT INTO egresado_logro_laboral (id_egresado, id_logro_laboral) VALUES (?, ?)`,
      [idEgresado, insertId]
    );
    return { id_labor_achievement: insertId, ...data };
  }

  async findAllByEgresado(idEgresado: number): Promise<LaborAchievement[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date
       FROM logro_laboral l
       INNER JOIN egresado_logro_laboral el ON l.id_logro_laboral = el.id_logro_laboral
       WHERE el.id_egresado = ?`,
      [idEgresado]
    );
    return rows;
  }

  async findAll(): Promise<LaborAchievement[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date
       FROM logro_laboral l`
    );
    return rows;
  }

  async findAllWithEgresadoId(): Promise<Array<LaborAchievement & { id_egresado: number }>> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date, el.id_egresado
       FROM logro_laboral l
       INNER JOIN egresado_logro_laboral el ON l.id_logro_laboral = el.id_logro_laboral`
    );
    return rows;
  }

  async findById(idEgresado: number, idAchievement: number): Promise<LaborAchievement | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date
       FROM logro_laboral l
       INNER JOIN egresado_logro_laboral el ON l.id_logro_laboral = el.id_logro_laboral
       WHERE el.id_egresado = ? AND l.id_logro_laboral = ?`,
      [idEgresado, idAchievement]
    );
    return rows[0] || null;
  }

  async update(idEgresado: number, idAchievement: number, data: Partial<LaborAchievement>): Promise<LaborAchievement | null> {
    const logro = await this.findById(idEgresado, idAchievement);
    if (!logro) return null;
    await MysqlConnection.execute(
      `UPDATE logro_laboral SET empresa = ?, puesto = ?, fecha = ? WHERE id_logro_laboral = ?`,
      [data.company || logro.company, data.position || logro.position, data.date || logro.date, idAchievement]
    );
    return { ...logro, ...data };
  }

  async delete(idEgresado: number, idAchievement: number): Promise<void> {
    const logro = await this.findById(idEgresado, idAchievement);
    if (!logro) return;
    await MysqlConnection.execute(
      `DELETE FROM egresado_logro_laboral WHERE id_egresado = ? AND id_logro_laboral = ?`,
      [idEgresado, idAchievement]
    );
    await MysqlConnection.execute(
      `DELETE FROM logro_laboral WHERE id_logro_laboral = ?`,
      [idAchievement]
    );
  }
}
