import { TypeQuestionRepository } from '../../../domain/port/typeQuestionRepository';
import { TypeQuestion } from '../../../domain/model/typeQuestion';

export abstract class BaseTypeQuestionRepository implements TypeQuestionRepository {
  create(_data: Omit<TypeQuestion, 'id_tipo_pregunta'>): Promise<TypeQuestion> {
    return Promise.reject(new Error('Method not implemented'));
  }
  update(_id: number, _data: Partial<TypeQuestion>): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  delete(_id: number): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findById(_id: number): Promise<TypeQuestion | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findAll(): Promise<TypeQuestion[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findByName(_nombre: string): Promise<TypeQuestion | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  isAssociatedWithQuestions(_id: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
}