import { EmailTemplateRepository } from '../../domain/port/emailTemplateRepository';
import { EmailTemplate } from '../../domain/model/emailTemplate';

export class GetEmailTemplates {
  constructor(private repository: EmailTemplateRepository) {}

  async execute(): Promise<EmailTemplate[]> {
    return this.repository.findAll();
  }
}
