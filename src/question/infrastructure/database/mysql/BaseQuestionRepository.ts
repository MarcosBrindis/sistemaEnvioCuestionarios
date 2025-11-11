import { QuestionRepository } from '../../../domain/port/questionRepository';
import { Question } from '../../../domain/model/question';

export abstract class BaseQuestionRepository implements QuestionRepository {
  create(_data: Omit<Question, 'id_pregunta'>): Promise<Question> {
    return Promise.reject(new Error('Method not implemented'));
  }
  update(_id: number, _data: Partial<Question>): Promise<Question> {
    return Promise.reject(new Error('Method not implemented'));
  }
  delete(_id: number): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findById(_id: number): Promise<Question | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findAll(): Promise<Question[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findByTypeQuestionId(_idTipoPregunta: number): Promise<Question[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  searchByText(_texto: string): Promise<Question[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  typeQuestionExists(_idTipoPregunta: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  getTypeQuestionName(_idTipoPregunta: number): Promise<string | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  countOptionsByQuestionId(_idPregunta: number): Promise<number> {
    return Promise.reject(new Error('Method not implemented'));
  }
  hasLikertOptions(): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  getQuestionWithOptions(_idPregunta: number): Promise<any> {
    return Promise.reject(new Error('Method not implemented'));
  }
  getLikertOptions(): Promise<any[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
}
