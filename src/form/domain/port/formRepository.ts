import { Formulario } from '../model/form';

export interface FormularioRepository {
  create(data: Omit<Formulario, 'id_formulario' | 'fecha_creacion'>): Promise<Formulario>;
  update(id: number, data: Partial<Formulario>): Promise<Formulario>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Formulario | null>;
  findAll(): Promise<Formulario[]>;
  findActiveByTitle(title: string): Promise<Formulario | null>;

  // Asociación con preguntas (pivot formulacion_pregunta)
  addQuestion(formularioId: number, preguntaId: number, orden: number): Promise<void>;
  removeQuestion(formularioId: number, preguntaId: number): Promise<void>;
  isQuestionAssociated(formularioId: number, preguntaId: number): Promise<boolean>;
  getQuestionsByForm(formularioId: number): Promise<Array<{ id_pregunta: number; orden: number }>>;
  countFormsByQuestionId(preguntaId: number): Promise<number>;

  // Validaciones de orden
  hasDuplicateOrder(formularioId: number, orden: number): Promise<boolean>;
  getMaxOrder(formularioId: number): Promise<number | null>;

  // Comprobaciones adicionales
  formHasEncuestaActive(formularioId: number): Promise<boolean>;
  preguntaExists(preguntaId: number): Promise<boolean>;
}
