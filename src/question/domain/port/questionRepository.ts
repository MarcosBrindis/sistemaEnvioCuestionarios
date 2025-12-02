import { Question } from '../model/question';

export interface QuestionRepository {
  create(data: Omit<Question, 'id_pregunta'>): Promise<Question>;
  update(id: number, data: Partial<Question>): Promise<Question>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Question | null>;
  findAll(): Promise<Question[]>;
  findByTypeQuestionId(idTipoPregunta: number): Promise<Question[]>;
  searchByText(texto: string): Promise<Question[]>;
  // Métodos para validaciones de negocio
  typeQuestionExists(idTipoPregunta: number): Promise<boolean>;
  getTypeQuestionName(idTipoPregunta: number): Promise<string | null>;
  countOptionsByQuestionId(idPregunta: number): Promise<number>;
  hasLikertOptions(): Promise<boolean>;
  // Métodos para obtener opciones de una pregunta
  getQuestionWithOptions(idPregunta: number): Promise<any>;
  getAllQuestionsWithOptions(): Promise<any[]>;
  getLikertOptions(): Promise<any[]>;
}