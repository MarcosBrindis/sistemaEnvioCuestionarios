import { SurveyRepository } from '../../domain/port/surveyRepository';
import { Survey } from '../../domain/model/survey';

export class CreateSurvey {
  constructor(private repository: SurveyRepository) {}

  async execute(data: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    if (!data.name || !data.formId || !data.templateId) {
      throw new Error('Name, formId, and templateId are required');
    }
    const exists = await this.repository.existsActiveByName(data.name);
    if (exists) {
      throw new Error('An active survey with this name already exists');
    }
    return this.repository.create(data);
  }
}
