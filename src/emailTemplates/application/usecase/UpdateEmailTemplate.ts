import { EmailTemplateRepository } from '../../domain/port/emailTemplateRepository';
import { EmailTemplate } from '../../domain/model/emailTemplate';

export class UpdateEmailTemplate {
  constructor(private repository: EmailTemplateRepository) {}

  async execute(id: number, data: { subject: string; body: string; typeId: number; layoutHtml?: string | null }): Promise<EmailTemplate | null> {
    if (!data.subject || !data.body || !data.typeId) {
      throw new Error('subject, body, and typeId are required');
    }
    return this.repository.update(id, {
      subject: data.subject,
      body: data.body,
      layoutHtml: data.layoutHtml ?? null,
      typeId: data.typeId
    });
  }
}
