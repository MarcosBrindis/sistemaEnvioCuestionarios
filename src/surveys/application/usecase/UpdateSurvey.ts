import { SurveyRepository } from '../../domain/port/surveyRepository';
import { Survey } from '../../domain/model/survey';

export class UpdateSurvey {
  constructor(private repository: SurveyRepository) {}

  async execute(id: number, data: Partial<Omit<Survey, 'id' | 'createdAt'>>): Promise<Survey | null> {
    if (data.formId) {
      const canChange = await this.repository.canChangeForm(id);
      if (!canChange) {
        throw new Error('Cannot change form: survey already has responses');
      }
    }
    return this.repository.update(id, data);
  }
}
