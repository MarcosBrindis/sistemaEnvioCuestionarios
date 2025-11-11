import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseTypeQuestionRepository } from './BaseTypeQuestionRepository';
import { TypeQuestion } from '../../../domain/model/typeQuestion';

export class TypeQuestionRepositoryMySQL extends BaseTypeQuestionRepository {
  async create(data: Omit<TypeQuestion, 'id_tipo_pregunta'>): Promise<TypeQuestion> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO tipo_Pregunta (nombre) VALUES (?)`,
      [data.nombre]
    );
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM tipo_Pregunta WHERE id_tipo_pregunta = ?`,
      [insertId]
    );
    return rows[0];
  }

async update(id: number, data: Partial<TypeQuestion>): Promise<void> {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    // No hay campos para actualizar, no hacer nada
    return;
  }
  const fields = keys.map(key => `\`${key}\` = ?`).join(', ');
  const values = Object.values(data);
  await MysqlConnection.execute(
    `UPDATE tipo_Pregunta SET ${fields} WHERE id_tipo_pregunta = ?`,
    [...values, id]
  );
}

  async delete(id: number): Promise<void> {
    await MysqlConnection.execute(
      `DELETE FROM tipo_Pregunta WHERE id_tipo_pregunta = ?`,
      [id]
    );
  }

  async findById(id: number): Promise<TypeQuestion | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM tipo_Pregunta WHERE id_tipo_pregunta = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<TypeQuestion[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM tipo_Pregunta`
    );
    return rows;
  }

  async findByName(nombre: string): Promise<TypeQuestion | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM tipo_Pregunta WHERE LOWER(nombre) = LOWER(?)`,
      [nombre]
    );
    return rows.length > 0 ? rows[0] : null;
  }
//mas adelante se usa
  async isAssociatedWithQuestions(id: number): Promise<boolean> {
    // Asumiendo que hay una tabla 'Pregunta' que referencia a 'TipoPregunta'
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM pregunta WHERE id_tipo_pregunta = ?`,
      [id]
    );
    return rows[0].count > 0;
  }
}