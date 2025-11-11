import { TypeQuestion } from '../../domain/model/typeQuestion';
import { TypeQuestionRepository } from '../../domain/port/typeQuestionRepository';

export class CreateTypeQuestion {
  constructor(private repo: TypeQuestionRepository) {}

  async execute(data: Omit<TypeQuestion, 'id' | 'creado_en' | 'actualizado_en'>): Promise<TypeQuestion> {
    // Regla: El campo nombre es obligatorio y no puede ser nulo ni vacío
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim() === '') {
      throw new Error('El campo nombre es obligatorio y no puede estar vacío');
    }

    const nombreNormalizado = data.nombre.trim();

    // Regla: No se permite registrar más de un tipo de pregunta con el mismo nombre (case-insensitive)
    const existingTypeQuestion = await this.repo.findByName(nombreNormalizado.toLowerCase());
    if (existingTypeQuestion) {
      throw new Error('Ya existe un tipo de pregunta con ese nombre');
    }

    // Crear el tipo de pregunta con el nombre normalizado
    return this.repo.create({
      ...data,
      nombre: nombreNormalizado
    });
  }
}