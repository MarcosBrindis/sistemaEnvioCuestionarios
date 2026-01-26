import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseSurveyRepository } from './BaseSurveyRepository';
import { Survey } from '../../../domain/model/survey';

export class SurveyRepositoryMySQL extends BaseSurveyRepository {
  async findAll(params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ meta: any; data: Survey[] }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;
    let where: string[] = [];
    let values: any[] = [];
    if (typeof params.isActive === 'boolean') {
      where.push('is_active = ?');
      values.push(params.isActive ? 1 : 0);
    }
    if (params.search) {
      where.push('(nombre LIKE ? OR descripcion LIKE ?)');
      values.push(`%${params.search}%`, `%${params.search}%`);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [rows]: [any[], any] = await MysqlConnection.query(
      `SELECT * FROM encuesta ${whereClause} ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );
    const [countRows]: [any[], any] = await MysqlConnection.query(
      `SELECT COUNT(*) as total FROM encuesta ${whereClause}`,
      values
    );
    return {
      meta: {
        total_records: countRows[0]?.total ?? 0,
        current_page: page,
        total_pages: Math.ceil((countRows[0]?.total ?? 0) / limit),
        limit,
      },
      data: rows.map(row => ({
        id: row.id_encuesta,
        name: row.nombre,
        description: row.descripcion,
        createdAt: row.fecha_creacion,
        isActive: !!row.is_active,
        formId: row.id_formulario,
        templateId: row.id_template
      })),
    };
  }

  async findById(id: number): Promise<Survey | null> {
    const [rows]: [any[], any] = await MysqlConnection.query('SELECT * FROM encuesta WHERE id_encuesta = ?', [id]);
    if (!rows[0]) return null;
    const row = rows[0];
    // Mapear los campos de la base de datos al modelo Survey
    return {
      id: row.id_encuesta,
      name: row.nombre,
      description: row.descripcion,
      createdAt: row.fecha_creacion,
      isActive: !!row.is_active,
      formId: row.id_formulario,
      templateId: row.id_template
    };
  }

  async create(survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    // Validación de nombre único activo
    const exists = await this.existsActiveByName(survey.name);
    if (exists) throw new Error('Ya existe una encuesta activa con ese nombre');
    const [result]: any = await MysqlConnection.query(
      'INSERT INTO encuesta (nombre, descripcion, is_active, id_formulario, id_template, fecha_creacion) VALUES (?, ?, ?, ?, ?, NOW())',
      [survey.name, survey.description, survey.isActive ? 1 : 0, survey.formId, survey.templateId]
    );
    return this.findById(result.insertId) as Promise<Survey>;
  }

  async update(id: number, data: Partial<Omit<Survey, 'id' | 'createdAt'>>): Promise<Survey | null> {
    // Restricción: Si la encuesta tiene respuestas, no se puede cambiar el formulario
    if (data.formId !== undefined) {
      const canChange = await this.canChangeForm(id);
      if (!canChange) throw new Error('No se puede cambiar el formulario porque la encuesta tiene respuestas');
    }
    // Validación de nombre único activo (si cambia el nombre)
    if (data.name) {
      const [rows]: [any[], any] = await MysqlConnection.query(
        'SELECT id_encuesta FROM encuesta WHERE nombre = ? AND is_active = 1 AND id_encuesta != ?',
        [data.name, id]
      );
      if (rows.length > 0) throw new Error('Ya existe otra encuesta activa con ese nombre');
    }
    // Mapear los campos correctamente
    const fieldMap: Record<string, string> = {
      name: 'nombre',
      description: 'descripcion',
      isActive: 'is_active',
      formId: 'id_formulario',
      templateId: 'id_template'
    };
    const keys = Object.keys(data).filter(k => (data as any)[k] !== undefined);
    if (keys.length === 0) return this.findById(id);
    const fields = keys.map(k => `${fieldMap[k] || k} = ?`).join(', ');
    const values = keys.map(k => (data as any)[k]);
    await MysqlConnection.query(`UPDATE encuesta SET ${fields} WHERE id_encuesta = ?`, [...values, id]);
    return this.findById(id);
  }

  async delete(id: number): Promise<'deleted' | 'deactivated'> {
    // "Intelligent delete": Si tiene respuestas, desactivar; si no, eliminar
    const hasResp = await this.hasResponses(id);
    if (hasResp) {
      await MysqlConnection.query('UPDATE encuesta SET is_active = 0 WHERE id_encuesta = ?', [id]);
      return 'deactivated';
    } else {
      await MysqlConnection.query('DELETE FROM encuesta WHERE id_encuesta = ?', [id]);
      return 'deleted';
    }
  }

  async existsActiveByName(name: string): Promise<boolean> {
    const [rows]: [any[], any] = await MysqlConnection.query('SELECT id_encuesta FROM encuesta WHERE nombre = ? AND is_active = 1', [name]);
    return rows.length > 0;
  }

  async hasResponses(id: number): Promise<boolean> {
    // Busca si hay respuestas asociadas al formulario de la encuesta
    // Primero obtener el id_formulario de la encuesta
    const [encRows]: [any[], any] = await MysqlConnection.query('SELECT id_formulario FROM encuesta WHERE id_encuesta = ?', [id]);
    if (!encRows[0] || !encRows[0].id_formulario) return false;
    const formId = encRows[0].id_formulario;
    const [rows]: [any[], any] = await MysqlConnection.query('SELECT 1 FROM respuesta WHERE id_formulario = ? LIMIT 1', [formId]);
    return rows.length > 0;
  }

  async canChangeForm(id: number): Promise<boolean> {
    // Solo se puede cambiar el formulario si no hay respuestas
    return !(await this.hasResponses(id));
  }
}
