import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseQuestionRepository } from './BaseQuestionRepository';
import { Question } from '../../../domain/model/question';

export class QuestionRepositoryMySQL extends BaseQuestionRepository {
  async create(data: Omit<Question, 'id_pregunta'>): Promise<Question> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO pregunta (texto_pregunta, es_obligatoria, id_tipo_pregunta) VALUES (?, ?, ?)`,
      [data.texto_pregunta, data.es_obligatoria, data.id_tipo_pregunta]
    );
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM pregunta WHERE id_pregunta = ?`,
      [insertId]
    );
    return rows[0];
  }

  async update(id: number, data: Partial<Question>): Promise<Question> {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      // No hay campos para actualizar, retornar la pregunta actual
      const question = await this.findById(id);
      return question!;
    }
    const fields = keys.map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(data);
    await MysqlConnection.execute(
      `UPDATE pregunta SET ${fields} WHERE id_pregunta = ?`,
      [...values, id]
    );
    
    // Retornar la pregunta actualizada
    const updatedQuestion = await this.findById(id);
    return updatedQuestion!;
  }

  async delete(id: number): Promise<void> {
    await MysqlConnection.execute(
      `DELETE FROM pregunta WHERE id_pregunta = ?`,
      [id]
    );
  }

  async findById(id: number): Promise<Question | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM pregunta WHERE id_pregunta = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<Question[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM pregunta`
    );
    return rows;
  }

  async findByTypeQuestionId(idTipoPregunta: number): Promise<Question[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM pregunta WHERE id_tipo_pregunta = ?`,
      [idTipoPregunta]
    );
    return rows;
  }

  async searchByText(texto: string): Promise<Question[]> {
    // Búsqueda case-insensitive y sin acentos usando UPPER y REPLACE
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM pregunta 
       WHERE UPPER(
         REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
           REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
             REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(texto_pregunta, 
             'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u'), 
             'Á','A'), 'É','E'), 'Í','I'), 'Ó','O'), 'Ú','U'),
             'ñ','n'), 'Ñ','N'), 'ü','u'), 'Ü','U'), 'ç','c')
       ) LIKE UPPER(
         REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
           REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
             REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 
             'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u'), 
             'Á','A'), 'É','E'), 'Í','I'), 'Ó','O'), 'Ú','U'),
             'ñ','n'), 'Ñ','N'), 'ü','u'), 'Ü','U'), 'ç','c')
       )`,
      [`%${texto}%`]
    );
    return rows;
  }

  async typeQuestionExists(idTipoPregunta: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM tipo_pregunta WHERE id_tipo_pregunta = ?`,
      [idTipoPregunta]
    );
    return rows[0].count > 0;
  }

  async getTypeQuestionName(idTipoPregunta: number): Promise<string | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT nombre FROM tipo_pregunta WHERE id_tipo_pregunta = ?`,
      [idTipoPregunta]
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

  async hasLikertOptions(): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM opcion_pregunta WHERE etiqueta LIKE 'likert-%'`
    );
    return rows[0].count > 0;
  }

  async getQuestionWithOptions(idPregunta: number): Promise<any> {
    // Obtener la pregunta
    const question = await this.findById(idPregunta);
    if (!question) {
      return null;
    }

    // Obtener el nombre del tipo de pregunta
    const tipoNombre = await this.getTypeQuestionName(question.id_tipo_pregunta);

    // Obtener las opciones asociadas a la pregunta
    const [options]: any = await MysqlConnection.execute(
      `SELECT id_opcion_pregunta, texto_opcion, etiqueta 
       FROM opcion_pregunta 
       WHERE id_pregunta = ? 
       ORDER BY etiqueta`,
      [idPregunta]
    );

    return {
      ...question,
      tipo_pregunta_nombre: tipoNombre,
      opciones: options
    };
  }

  async getLikertOptions(): Promise<any[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT id_opcion_pregunta, texto_opcion, etiqueta 
       FROM opcion_pregunta 
       WHERE etiqueta LIKE 'likert-%' 
       ORDER BY etiqueta`
    );
    return rows;
  }
}
