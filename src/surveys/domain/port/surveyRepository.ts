import { Survey } from '../model/survey';

export interface SurveyRepository {
  findAll(params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ meta: any; data: Survey[] }>;
  findById(id: number): Promise<Survey | null>;
  create(survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey>;
  update(id: number, data: Partial<Omit<Survey, 'id' | 'createdAt'>>): Promise<Survey | null>;
  delete(id: number): Promise<'deleted' | 'deactivated'>;
  existsActiveByName(name: string): Promise<boolean>;
  hasResponses(id: number): Promise<boolean>;
  canChangeForm(id: number): Promise<boolean>;
}
