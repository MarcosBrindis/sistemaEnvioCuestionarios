import { OpcionPregunta } from '../model/opcionPregunta';

export interface OpcionPreguntaRepository {
  create(data: Omit<OpcionPregunta, 'id_opcion_pregunta'>): Promise<OpcionPregunta>;
  update(id: number, data: Partial<OpcionPregunta>): Promise<OpcionPregunta>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<OpcionPregunta | null>;
  findAll(): Promise<OpcionPregunta[]>;
  findByQuestionId(idPregunta: number): Promise<OpcionPregunta[]>;
  
  // Métodos para validaciones de negocio
  isTextUniqueForQuestion(idPregunta: number, textoOpcion: string, excludeId?: number): Promise<boolean>;
  isLabelUniqueForQuestion(idPregunta: number, etiqueta: string, excludeId?: number): Promise<boolean>;
  questionExists(idPregunta: number): Promise<boolean>;
  getQuestionType(idPregunta: number): Promise<string | null>;
  countOptionsByQuestionId(idPregunta: number): Promise<number>;
}