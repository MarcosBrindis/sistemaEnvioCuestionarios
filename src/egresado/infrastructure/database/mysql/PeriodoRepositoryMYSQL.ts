import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BasePeriodoRepository } from './BaseEgresadoRepository';

export interface Periodo {
  id_periodo: number;
  fecha_inicio: string;
  fecha_fin: string;
  cohorte: string;
}

export class PeriodoRepositoryMySQL extends BasePeriodoRepository {
  async create(data: { fecha_inicio: string; fecha_fin: string; cohorte: string }): Promise<Periodo> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO periodo_graduado (fecha_inicio, fecha_fin, cohorte) VALUES (?, ?, ?)`,
      [data.fecha_inicio, data.fecha_fin, data.cohorte]
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

  async findByPeriodoIdExterno(periodo_id: string): Promise<Periodo | null> {
    return this.findByCohorte(periodo_id);
  }
}
