import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseOpcionPreguntaRepository } from './BaseOpcionPreguntaRepository';
import { OpcionPregunta } from '../../../domain/model/opcionPregunta';

export class OpcionPreguntaRepositoryMySQL extends BaseOpcionPreguntaRepository {
  async create(data: Omit<OpcionPregunta, 'id_opcion_pregunta'>): Promise<OpcionPregunta> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO opcion_pregunta (texto_opcion, etiqueta, id_pregunta) VALUES (?, ?, ?)`,
      [data.texto_opcion, data.etiqueta, data.id_pregunta]
    );
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM opcion_pregunta WHERE id_opcion_pregunta = ?`,
      [insertId]
    );
    return rows[0];
  }

  async update(id: number, data: Partial<OpcionPregunta>): Promise<OpcionPregunta> {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      // No hay campos para actualizar, retornar la opción actual
      const option = await this.findById(id);
      return option!;
    }
    const fields = keys.map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(data);
    await MysqlConnection.execute(
      `UPDATE opcion_pregunta SET ${fields} WHERE id_opcion_pregunta = ?`,
      [...values, id]
    );
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM opcion_pregunta WHERE id_opcion_pregunta = ?`,
      [id]
    );
    return rows[0];
  }

  async delete(id: number): Promise<void> {
    await MysqlConnection.execute(
      `DELETE FROM opcion_pregunta WHERE id_opcion_pregunta = ?`,
      [id]
    );
  }

  async findById(id: number): Promise<OpcionPregunta | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM opcion_pregunta WHERE id_opcion_pregunta = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<OpcionPregunta[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM opcion_pregunta ORDER BY id_opcion_pregunta ASC`
    );
    return rows;
  }

  async findByQuestionId(idPregunta: number): Promise<OpcionPregunta[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM opcion_pregunta WHERE id_pregunta = ? ORDER BY id_opcion_pregunta ASC`,
      [idPregunta]
    );
    return rows;
  }

  // Métodos para validaciones de negocio
  async isTextUniqueForQuestion(idPregunta: number, textoOpcion: string, excludeId?: number): Promise<boolean> {
    let query = `SELECT COUNT(*) as count FROM opcion_pregunta 
                 WHERE id_pregunta = ? AND UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(texto_opcion, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) = 
                       UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'))`;
    let params: any[] = [idPregunta, textoOpcion];
    
    if (excludeId !== undefined) {
      query += ` AND id_opcion_pregunta != ?`;
      params.push(excludeId);
    }
    
    const [rows]: any = await MysqlConnection.execute(query, params);
    return rows[0].count === 0;
  }

  async isLabelUniqueForQuestion(idPregunta: number, etiqueta: string, excludeId?: number): Promise<boolean> {
    let query = `SELECT COUNT(*) as count FROM opcion_pregunta 
                 WHERE id_pregunta = ? AND UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(etiqueta, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) = 
                       UPPER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'))`;
    let params: any[] = [idPregunta, etiqueta];
    
    if (excludeId !== undefined) {
      query += ` AND id_opcion_pregunta != ?`;
      params.push(excludeId);
    }
    
    const [rows]: any = await MysqlConnection.execute(query, params);
    return rows[0].count === 0;
  }

  async questionExists(idPregunta: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM pregunta WHERE id_pregunta = ?`,
      [idPregunta]
    );
    return rows[0].count > 0;
  }

  async getQuestionType(idPregunta: number): Promise<string | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT tp.nombre 
       FROM pregunta p 
       INNER JOIN tipo_pregunta tp ON p.id_tipo_pregunta = tp.id_tipo_pregunta 
       WHERE p.id_pregunta = ?`,
      [idPregunta]
    );
    return rows.length > 0 ? rows[0].nombre : null;
  }

  async countOptionsByQuestionId(idPregunta: number): Promise<number> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM opcion_pregunta WHERE id_pregunta = ?`,
      [idPregunta]
    );
    return rows[0].count;
  }
}