import { TypeQuestion } from '../model/typeQuestion';

export interface TypeQuestionRepository {
  create(data: Omit<TypeQuestion, 'id' | 'creado_en' | 'actualizado_en'>): Promise<TypeQuestion>;
  update(id: number, data: Partial<TypeQuestion>): Promise<void>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<TypeQuestion | null>;
  findAll(): Promise<TypeQuestion[]>;
  findByName(nombre: string): Promise<TypeQuestion | null>;
  isAssociatedWithQuestions(id: number): Promise<boolean>;
}