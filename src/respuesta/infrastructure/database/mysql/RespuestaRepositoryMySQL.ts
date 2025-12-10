import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { Respuesta } from '../../../domain/model/respuesta';
import { RespuestaRepository } from '../../../domain/port/respuestaRepository';

export class RespuestaRepositoryMySQL implements RespuestaRepository {
  async create(data: Omit<Respuesta, 'id_respuesta' | 'fecha_respuesta'>): Promise<Respuesta> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO respuesta (id_egresado, id_formulario, respuestas_json) VALUES (?, ?, ?)`,
      [data.id_egresado, data.id_formulario, JSON.stringify(data.respuestas_json)]
    );
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM respuesta WHERE id_respuesta = ?`,
      [insertId]
    );
    return rows[0];
  }

  async findAll(filters?: { id_formulario?: number; id_egresado?: number }): Promise<Respuesta[]> {
    let query = `SELECT * FROM respuesta`;
    const params: any[] = [];
    const conditions: string[] = [];
    if (filters?.id_formulario) {
      conditions.push('id_formulario = ?');
      params.push(filters.id_formulario);
    }
    if (filters?.id_egresado) {
      conditions.push('id_egresado = ?');
      params.push(filters.id_egresado);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY fecha_respuesta DESC';
    const [rows]: any = await MysqlConnection.execute(query, params);
    return rows;
  }

  async findById(id: number): Promise<Respuesta | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM respuesta WHERE id_respuesta = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async delete(id: number): Promise<void> {
    await MysqlConnection.execute(
      `DELETE FROM respuesta WHERE id_respuesta = ?`,
      [id]
    );
  }

  async existsByEgresadoAndFormulario(id_egresado: number, id_formulario: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM respuesta WHERE id_egresado = ? AND id_formulario = ?`,
      [id_egresado, id_formulario]
    );
    return rows[0].count > 0;
  }
}
