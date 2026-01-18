import { SurveyRepository } from '../../../domain/port/surveyRepository';
import { Survey } from '../../../domain/model/survey';

export abstract class BaseSurveyRepository implements SurveyRepository {
  findAll(_params: any): Promise<{ meta: any; data: Survey[] }> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findById(_id: number): Promise<Survey | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  create(_survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    return Promise.reject(new Error('Method not implemented'));
  }
  update(_id: number, _data: Partial<Omit<Survey, 'id' | 'createdAt'>>): Promise<Survey | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  delete(_id: number): Promise<'deleted' | 'deactivated'> {
    return Promise.reject(new Error('Method not implemented'));
  }
  existsActiveByName(_name: string): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  hasResponses(_id: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  canChangeForm(_id: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
}
