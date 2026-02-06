import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { FormularioRepository } from '../../../domain/port/formRepository';
import { Formulario } from '../../../domain/model/form';

export class FormularioRepositoryMySQL implements FormularioRepository {
  async getQuestionsWithOptionsByFormId(formularioId: number): Promise<any[]> {
    // 1. Obtener preguntas asociadas al formulario y su orden
    const [preguntas]: any = await MysqlConnection.execute(
      `SELECT fp.id_pregunta, fp.orden, p.texto_pregunta, p.es_obligatoria, p.id_tipo_pregunta
       FROM formulacion_pregunta fp
       JOIN pregunta p ON fp.id_pregunta = p.id_pregunta
       WHERE fp.id_formulario = ?
       ORDER BY fp.orden ASC`,
      [formularioId]
    );

    // 2. Para cada pregunta, obtener tipo y opciones
    const results = [];
    for (const pregunta of preguntas) {
      // Obtener tipo de pregunta
      const [tipoRows]: any = await MysqlConnection.execute(
        `SELECT id_tipo_pregunta, nombre FROM tipo_pregunta WHERE id_tipo_pregunta = ?`,
        [pregunta.id_tipo_pregunta]
      );
      const tipoPregunta = tipoRows[0] || { id_tipo_pregunta: pregunta.id_tipo_pregunta, nombre: null };

      // Obtener opciones
      const [opciones]: any = await MysqlConnection.execute(
        `SELECT id_opcion_pregunta, texto_opcion, etiqueta FROM opcion_pregunta WHERE id_pregunta = ?`,
        [pregunta.id_pregunta]
      );

      results.push({
        id: pregunta.id_pregunta,
        texto_pregunta: pregunta.texto_pregunta,
        es_obligatoria: pregunta.es_obligatoria,
        orden_en_formulario: pregunta.orden,
        tipo_pregunta: {
          id: tipoPregunta.id_tipo_pregunta,
          nombre: tipoPregunta.nombre
        },
        opciones: opciones.map((op: any) => ({
          id: op.id_opcion_pregunta,
          texto_opcion: op.texto_opcion,
          etiqueta: op.etiqueta
        }))
      });
    }
    return results;
  }
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
    const [rows]: any = await MysqlConnection.execute(
      `SELECT id_pregunta FROM formulacion_pregunta WHERE id_formulario = ? ORDER BY orden ASC`,
      [formularioId]
    );
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

  async getQuestionsFormattedForPublic(formularioId: number): Promise<Array<{
    id: string;
    tipo: string;
    texto: string;
    es_obligatoria: boolean;
    orden: number;
    opciones: Array<{ id: string; valor: string }>;
  }>> {
    // Obtener preguntas asociadas al formulario
    const [preguntas]: any = await MysqlConnection.execute(
      `SELECT fp.id_pregunta, fp.orden, p.texto_pregunta, p.es_obligatoria, p.id_tipo_pregunta
       FROM formulacion_pregunta fp
       JOIN pregunta p ON fp.id_pregunta = p.id_pregunta
       WHERE fp.id_formulario = ?
       ORDER BY fp.orden ASC`,
      [formularioId]
    );

    const preguntasFormateadas = [];
    for (const pregunta of preguntas) {
      // Obtener tipo de pregunta
      const [tipoRows]: any = await MysqlConnection.execute(
        `SELECT nombre FROM tipo_pregunta WHERE id_tipo_pregunta = ?`,
        [pregunta.id_tipo_pregunta]
      );
      const tipo = tipoRows[0]?.nombre || 'desconocido';

      // Obtener opciones
      const [opciones]: any = await MysqlConnection.execute(
        `SELECT id_opcion_pregunta, texto_opcion FROM opcion_pregunta WHERE id_pregunta = ? ORDER BY id_opcion_pregunta ASC`,
        [pregunta.id_pregunta]
      );

      preguntasFormateadas.push({
        id: pregunta.id_pregunta.toString(),
        tipo: tipo,
        texto: pregunta.texto_pregunta,
        es_obligatoria: !!pregunta.es_obligatoria,
        orden: pregunta.orden,
        opciones: opciones.map((op: any) => ({
          id: op.id_opcion_pregunta.toString(),
          valor: op.texto_opcion
        }))
      });
    }

    return preguntasFormateadas;
  }
}

