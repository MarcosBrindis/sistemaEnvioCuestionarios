import { EmailTemplateRepository } from '../../domain/port/emailTemplateRepository';
import { EmailTemplate } from '../../domain/model/emailTemplate';

export class CreateEmailTemplate {
  constructor(private repository: EmailTemplateRepository) {}

  async execute(data: { subject: string; body: string; typeId: number; layoutHtml?: string | null }): Promise<EmailTemplate> {
    if (!data.subject || !data.body || !data.typeId) {
      throw new Error('subject, body, and typeId are required');
    }
    // Optionally: check for uniqueness of subject if needed
    return this.repository.create({
      subject: data.subject,
      body: data.body,
      layoutHtml: data.layoutHtml ?? null,
      typeId: data.typeId
    });
  }
}
