import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseEmailTemplateRepository } from './baseEmailTemplateRepository';
import { EmailTemplate } from '../../../domain/model/emailTemplate';

export class EmailTemplateRepositoryMySQL extends BaseEmailTemplateRepository {
  async findAll(): Promise<EmailTemplate[]> {
    const [rows]: any = await MysqlConnection.execute(
      'SELECT id_template AS id, asunto AS subject, cuerpo AS body, id_tipo_correo AS typeId FROM template_correo'
    );
    return rows;
  }

  async findById(id: number): Promise<EmailTemplate | null> {
    const [rows]: any = await MysqlConnection.execute(
      'SELECT id_template AS id, asunto AS subject, cuerpo AS body, id_tipo_correo AS typeId FROM template_correo WHERE id_template = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    const [result]: any = await MysqlConnection.execute(
      'INSERT INTO template_correo (asunto, cuerpo, id_tipo_correo) VALUES (?, ?, ?)',
      [template.subject, template.body, template.typeId]
    );
    const insertId = result.insertId;
    return this.findById(insertId) as Promise<EmailTemplate>;
  }

  async update(id: number, template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate | null> {
    await MysqlConnection.execute(
      'UPDATE template_correo SET asunto = ?, cuerpo = ?, id_tipo_correo = ? WHERE id_template = ?',
      [template.subject, template.body, template.typeId, id]
    );
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result]: any = await MysqlConnection.execute(
      'DELETE FROM template_correo WHERE id_template = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async isLinkedToSurvey(id: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      'SELECT COUNT(*) as count FROM encuesta WHERE id_template = ?',
      [id]
    );
    return rows[0].count > 0;
  }
}
