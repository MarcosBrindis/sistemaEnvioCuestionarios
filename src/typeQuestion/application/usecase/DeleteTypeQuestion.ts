import { TypeQuestionRepository } from '../../domain/port/typeQuestionRepository';

export class DeleteTypeQuestion {
  constructor(private repo: TypeQuestionRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar si el tipo de pregunta existe
    const existingTypeQuestion = await this.repo.findById(id);
    if (!existingTypeQuestion) {
      throw new Error('El tipo de pregunta no existe');
    }

    // Regla: No se puede eliminar un tipo de pregunta si está asociado a alguna pregunta existente
    const isAssociated = await this.repo.isAssociatedWithQuestions(id);
    if (isAssociated) {
      throw new Error('No se puede eliminar el tipo de pregunta porque está asociado a una o más preguntas');
    }

    await this.repo.delete(id);
  }
}