import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseProgramaEducativoRepository } from './BaseEgresadoRepository';

export interface ProgramaEducativo {
  id_programa_educativo: number;
  nombre: string;
}

export class ProgramaEducativoRepositoryMySQL extends BaseProgramaEducativoRepository {
  async create(data: { nombre: string }): Promise<ProgramaEducativo> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO programa_educativo (nombre) VALUES (?)`,
      [data.nombre]
    );
    
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM programa_educativo WHERE id_programa_educativo = ?`,
      [insertId]
    );
    return rows[0];
  }

  async findByIdOrNombre(id?: string, nombre?: string): Promise<ProgramaEducativo | null> {
    let query = `SELECT * FROM programa_educativo WHERE `;
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (id) {
      conditions.push(`id_programa_educativo = ?`);
      params.push(parseInt(id));
    }
    
    if (nombre) {
      conditions.push(`UPPER(nombre) = UPPER(?)`);
      params.push(nombre);
    }
    
    if (conditions.length === 0) {
      return null;
    }
    
    query += conditions.join(' OR ');
    query += ` LIMIT 1`;
    
    const [rows]: any = await MysqlConnection.execute(query, params);
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<ProgramaEducativo[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM programa_educativo ORDER BY nombre`
    );
    return rows;
  }
}