import { TemplateRepository } from '../../../domain/port/TemplateRepository';
import { EmailTemplate } from '../../../domain/model/EmailTemplate';
import { MysqlConnection } from '../../../../core/db/mysl/connection';

export class MysqlTemplateRepository implements TemplateRepository {
  async findById(id_template: number): Promise<EmailTemplate | null> {
    const [rows]: any = await MysqlConnection.query(
      'SELECT id_template, asunto, cuerpo FROM template_correo WHERE id_template = ?',
      [id_template]
    );
    return rows[0] || null;
  }
}
