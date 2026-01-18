import { SurveyRepository } from '../../domain/port/surveyRepository';
import { Survey } from '../../domain/model/survey';

export class GetSurveys {
  constructor(private repository: SurveyRepository) {}

  async execute(params: { page?: number; limit?: number; isActive?: boolean; search?: string }): Promise<{ meta: any; data: Survey[] }> {
    return this.repository.findAll(params);
  }
}
