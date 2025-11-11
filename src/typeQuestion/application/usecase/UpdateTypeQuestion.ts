import { TypeQuestionRepository } from '../../domain/port/typeQuestionRepository';
import { TypeQuestion } from '../../domain/model/typeQuestion';

export class UpdateTypeQuestion {
  constructor(private repo: TypeQuestionRepository) {}

  async execute(id: number, data: Partial<TypeQuestion>): Promise<TypeQuestion> {
    // Verificar si el tipo de pregunta existe
    const existingTypeQuestion = await this.repo.findById(id);
    if (!existingTypeQuestion) {
      throw new Error('El tipo de pregunta no existe');
    }

    // Si se está actualizando el nombre, validar reglas de negocio
    if (data.nombre) {
      // Regla: El campo nombre no puede ser nulo ni vacío
      if (typeof data.nombre !== 'string' || data.nombre.trim() === '') {
        throw new Error('El campo nombre no puede estar vacío');
      }

      const nombreNormalizado = data.nombre.trim();

      // Regla: No se permite registrar más de un tipo de pregunta con el mismo nombre (case-insensitive)
      const duplicateTypeQuestion = await this.repo.findByName(nombreNormalizado.toLowerCase());
      if (duplicateTypeQuestion && duplicateTypeQuestion.id_tipo_pregunta !== id) {
        throw new Error('Ya existe un tipo de pregunta con ese nombre');
      }

      // Normalizar el nombre
      data.nombre = nombreNormalizado;
    }

    await this.repo.update(id, data);
    
    // Retornar el tipo de pregunta actualizado
    const updatedTypeQuestion = await this.repo.findById(id);
    return updatedTypeQuestion!; // Ya verificamos que existe al inicio
  }
}