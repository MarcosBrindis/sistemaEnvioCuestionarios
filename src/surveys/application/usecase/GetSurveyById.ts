import { SurveyRepository } from '../../domain/port/surveyRepository';
import { Survey } from '../../domain/model/survey';

export class GetSurveyById {
  constructor(private repository: SurveyRepository) {}

  async execute(id: number): Promise<Survey | null> {
    return this.repository.findById(id);
  }
}
