import { OpcionPreguntaRepository } from '../../../domain/port/opcionPreguntaRepository';
import { OpcionPregunta } from '../../../domain/model/opcionPregunta';

export abstract class BaseOpcionPreguntaRepository implements OpcionPreguntaRepository {
  create(_data: Omit<OpcionPregunta, 'id_opcion_pregunta'>): Promise<OpcionPregunta> {
    return Promise.reject(new Error('Method not implemented'));
  }
  update(_id: number, _data: Partial<OpcionPregunta>): Promise<OpcionPregunta> {
    return Promise.reject(new Error('Method not implemented'));
  }
  delete(_id: number): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findById(_id: number): Promise<OpcionPregunta | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findAll(): Promise<OpcionPregunta[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findByQuestionId(_idPregunta: number): Promise<OpcionPregunta[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  // Métodos para validaciones de negocio
  isTextUniqueForQuestion(_idPregunta: number, _textoOpcion: string, _excludeId?: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  isLabelUniqueForQuestion(_idPregunta: number, _etiqueta: string, _excludeId?: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  questionExists(_idPregunta: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  getQuestionType(_idPregunta: number): Promise<string | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  countOptionsByQuestionId(_idPregunta: number): Promise<number> {
    return Promise.reject(new Error('Method not implemented'));
  }
}