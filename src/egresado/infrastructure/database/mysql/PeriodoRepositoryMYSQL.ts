import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BasePeriodoRepository } from './BaseEgresadoRepository';

export interface Periodo {
  id_periodo: number;
  fecha_inicio: string;
  fecha_fin: string;
  cohorte: string;
  periodo_id_externo: string | null;
}

export class PeriodoRepositoryMySQL extends BasePeriodoRepository {
  async create(data: { fecha_inicio: string; fecha_fin: string; cohorte: string; periodo_id_externo?: string }): Promise<Periodo> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO periodo_graduado (fecha_inicio, fecha_fin, cohorte, periodo_id_externo) VALUES (?, ?, ?, ?)`,
      [data.fecha_inicio, data.fecha_fin, data.cohorte, data.periodo_id_externo || null]
    );
    
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM periodo_graduado WHERE id_periodo = ?`,
      [insertId]
    );
    return rows[0];
  }

  async findByCohorte(cohorte: string): Promise<Periodo | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM periodo_graduado WHERE cohorte = ?`,
      [cohorte]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<Periodo[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM periodo_graduado ORDER BY fecha_inicio DESC`
    );
    return rows;
  }

  async findByPeriodoIdExterno(periodo_id_externo: string): Promise<Periodo | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM periodo_graduado WHERE periodo_id_externo = ?`,
      [periodo_id_externo]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async updatePeriodoIdExterno(cohorte: string, periodo_id_externo: string): Promise<void> {
    await MysqlConnection.execute(
      `UPDATE periodo_graduado SET periodo_id_externo = ? WHERE cohorte = ?`,
      [periodo_id_externo, cohorte]
    );
  }
}
