import { OpcionPreguntaRepository } from '../../domain/port/opcionPreguntaRepository';

export class DeleteOpcionPregunta {
  constructor(private repo: OpcionPreguntaRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar si la opción existe
    const existingOption = await this.repo.findById(id);
    if (!existingOption) {
      throw new Error('La opción de pregunta no existe');
    }

    // Obtener el tipo de pregunta para validar reglas de eliminación
    const questionType = await this.repo.getQuestionType(existingOption.id_pregunta);
    if (!questionType) {
      throw new Error('No se pudo determinar el tipo de la pregunta asociada');
    }

    // Contar opciones existentes antes de eliminar
    const currentOptionsCount = await this.repo.countOptionsByQuestionId(existingOption.id_pregunta);

    // Validar reglas específicas por tipo de pregunta antes de eliminar
    if (questionType === 'boolean' && currentOptionsCount <= 2) {
      throw new Error('Las preguntas de tipo "boolean" deben tener exactamente 2 opciones. No se puede eliminar esta opción.');
    }

    if ((questionType === 'multiple' || questionType === 'opción múltiple') && currentOptionsCount <= 2) {
      throw new Error('Las preguntas de tipo "multiple" deben tener al menos 2 opciones. No se puede eliminar esta opción.');
    }

    await this.repo.delete(id);
  }
}