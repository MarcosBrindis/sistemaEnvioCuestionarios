import { SurveyRepository } from '../../domain/port/surveyRepository';

export class DeleteSurvey {
  constructor(private repository: SurveyRepository) {}

  async execute(id: number): Promise<'deleted' | 'deactivated'> {
    return this.repository.delete(id);
  }
}
