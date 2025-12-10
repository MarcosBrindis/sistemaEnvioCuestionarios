import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { AcademicAchievement } from '../../../domain/model/academicAchievement';
import { AcademicAchievementRepository } from '../../../domain/port/academicAchievementRepository';

export class AcademicAchievementRepositoryMySQL implements AcademicAchievementRepository {
  async create(idEgresado: number, data: Omit<AcademicAchievement, 'id_academic_achievement'>): Promise<AcademicAchievement> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO logro_academico (nombre, institucion, fecha) VALUES (?, ?, ?)`,
      [data.name, data.institution, data.date || null]
    );
    const insertId = result.insertId || (result[0] && result[0].insertId);
    await MysqlConnection.execute(
      `INSERT INTO egresado_logro_academico (id_egresado, id_logro_academico) VALUES (?, ?)`,
      [idEgresado, insertId]
    );
    return { id_academic_achievement: insertId, ...data };
  }

  async findAllByEgresado(idEgresado: number): Promise<AcademicAchievement[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT a.id_logro_academico as id_academic_achievement, a.nombre as name, a.institucion as institution, a.fecha as date
       FROM logro_academico a
       INNER JOIN egresado_logro_academico ea ON a.id_logro_academico = ea.id_logro_academico
       WHERE ea.id_egresado = ?`,
      [idEgresado]
    );
    return rows;
  }

  async findById(idEgresado: number, idAchievement: number): Promise<AcademicAchievement | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT a.id_logro_academico as id_academic_achievement, a.nombre as name, a.institucion as institution, a.fecha as date
       FROM logro_academico a
       INNER JOIN egresado_logro_academico ea ON a.id_logro_academico = ea.id_logro_academico
       WHERE ea.id_egresado = ? AND a.id_logro_academico = ?`,
      [idEgresado, idAchievement]
    );
    return rows[0] || null;
  }

  async update(idEgresado: number, idAchievement: number, data: Partial<AcademicAchievement>): Promise<AcademicAchievement | null> {
    const logro = await this.findById(idEgresado, idAchievement);
    if (!logro) return null;
    await MysqlConnection.execute(
      `UPDATE logro_academico SET nombre = ?, institucion = ?, fecha = ? WHERE id_logro_academico = ?`,
      [data.name || logro.name, data.institution || logro.institution, data.date || logro.date, idAchievement]
    );
    return { ...logro, ...data };
  }

  async delete(idEgresado: number, idAchievement: number): Promise<void> {
      const logro = await this.findById(idEgresado, idAchievement);
    if (!logro) return;
    await MysqlConnection.execute(
      `DELETE FROM egresado_logro_academico WHERE id_egresado = ? AND id_logro_academico = ?`,
      [idEgresado, idAchievement]
    );
    await MysqlConnection.execute(
      `DELETE FROM logro_academico WHERE id_logro_academico = ?`,
      [idAchievement]
    );
  }
}
