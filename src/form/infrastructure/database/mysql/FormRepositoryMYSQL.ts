import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { FormularioRepository } from '../../../domain/port/formRepository';
import { Formulario } from '../../../domain/model/form';

export class FormularioRepositoryMySQL implements FormularioRepository {
  async create(data: Omit<Formulario, 'id_formulario' | 'fecha_creacion'>): Promise<Formulario> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO formulario (titulo, descripcion, fecha_creacion, is_active) VALUES (?, ?, NOW(), ?)`,
      [data.titulo, data.descripcion, data.is_active]
    );
    const insertId = (result as any).insertId;
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM formulario WHERE id_formulario = ?`,
      [insertId]
    );
    return rows[0];
  }

  async update(id: number, data: Partial<Formulario>): Promise<Formulario> {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      const f = await this.findById(id);
      return f!;
    }
    const fields = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = Object.values(data);
    await MysqlConnection.execute(
      `UPDATE formulario SET ${fields} WHERE id_formulario = ?`,
      [...values, id]
    );
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM formulario WHERE id_formulario = ?`,
      [id]
    );
    return rows[0];
  }

  async delete(id: number): Promise<void> {
    await MysqlConnection.execute(`DELETE FROM formulario WHERE id_formulario = ?`, [id]);
  }

  async findById(id: number): Promise<Formulario | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM formulario WHERE id_formulario = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<Formulario[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM formulario ORDER BY id_formulario ASC`
    );
    return rows;
  }

  async findActiveByTitle(title: string): Promise<Formulario | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM formulario WHERE is_active = true AND UPPER(titulo) = UPPER(?)`,
      [title]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // pivot: formulacion_pregunta
  async addQuestion(formularioId: number, preguntaId: number, orden: number): Promise<void> {
    await MysqlConnection.execute(
      `INSERT INTO formulacion_pregunta (id_formulario, id_pregunta, orden) VALUES (?, ?, ?)`,
      [formularioId, preguntaId, orden]
    );
  }

  async removeQuestion(formularioId: number, preguntaId: number): Promise<void> {
    await MysqlConnection.execute(
      `DELETE FROM formulacion_pregunta WHERE id_formulario = ? AND id_pregunta = ?`,
      [formularioId, preguntaId]
    );
    // Reordenar para mantener consecutividad: renumera los ordenes asc por orden
    const [rows]: any = await MysqlConnection.execute(
      `SELECT id_pregunta FROM formulacion_pregunta WHERE id_formulario = ? ORDER BY orden ASC`,
      [formularioId]
    );
    // Reassign orders starting at 1
    let order = 1;
    for (const r of rows) {
      await MysqlConnection.execute(
        `UPDATE formulacion_pregunta SET orden = ? WHERE id_formulario = ? AND id_pregunta = ?`,
        [order, formularioId, r.id_pregunta]
      );
      order++;
    }
  }

  async isQuestionAssociated(formularioId: number, preguntaId: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM formulacion_pregunta WHERE id_formulario = ? AND id_pregunta = ?`,
      [formularioId, preguntaId]
    );
    return rows[0].count > 0;
  }

  async getQuestionsByForm(formularioId: number): Promise<Array<{ id_pregunta: number; orden: number }>> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT id_pregunta, orden FROM formulacion_pregunta WHERE id_formulario = ? ORDER BY orden ASC`,
      [formularioId]
    );
    return rows;
  }

  async countFormsByQuestionId(preguntaId: number): Promise<number> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(DISTINCT id_formulario) as count FROM formulacion_pregunta WHERE id_pregunta = ?`,
      [preguntaId]
    );
    return rows[0].count;
  }

  async hasDuplicateOrder(formularioId: number, orden: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM formulacion_pregunta WHERE id_formulario = ? AND orden = ?`,
      [formularioId, orden]
    );
    return rows[0].count > 0;
  }

  async getMaxOrder(formularioId: number): Promise<number | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT MAX(orden) as maxOrder FROM formulacion_pregunta WHERE id_formulario = ?`,
      [formularioId]
    );
    const v = rows[0].maxOrder;
    return v === null ? null : Number(v);
  }

  async formHasEncuestaActive(formularioId: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM encuesta WHERE id_formulario = ? AND is_active = true`,
      [formularioId]
    );
    return rows[0].count > 0;
  }

  async preguntaExists(preguntaId: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM pregunta WHERE id_pregunta = ?`,
      [preguntaId]
    );
    return rows[0].count > 0;
  }
}
