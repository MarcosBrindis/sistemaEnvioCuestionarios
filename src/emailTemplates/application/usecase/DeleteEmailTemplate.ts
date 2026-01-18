import { EmailTemplateRepository } from '../../domain/port/emailTemplateRepository';

export class DeleteEmailTemplate {
  constructor(private repository: EmailTemplateRepository) {}

  async execute(id: number): Promise<boolean> {
    // Check if template is linked to a survey
    const isLinked = await this.repository.isLinkedToSurvey(id);
    if (isLinked) {
      throw new Error('Cannot delete: template is linked to a survey');
    }
    return this.repository.delete(id);
  }
}
