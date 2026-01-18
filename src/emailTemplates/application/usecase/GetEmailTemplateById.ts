import { EmailTemplateRepository } from '../../domain/port/emailTemplateRepository';
import { EmailTemplate } from '../../domain/model/emailTemplate';

export class GetEmailTemplateById {
  constructor(private repository: EmailTemplateRepository) {}

  async execute(id: number): Promise<EmailTemplate | null> {
    return this.repository.findById(id);
  }
}
