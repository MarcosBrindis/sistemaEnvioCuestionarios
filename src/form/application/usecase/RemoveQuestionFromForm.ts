import { FormularioRepository } from '../../domain/port/formRepository';

export class RemoveQuestionFromFormulario {
  constructor(private repo: FormularioRepository) {}

  async execute(formularioId: number, preguntaId: number): Promise<void> {
    const formulario = await this.repo.findById(formularioId);
    if (!formulario) throw new Error('El formulario especificado no existe');

    const associated = await this.repo.isQuestionAssociated(formularioId, preguntaId);
    if (!associated) throw new Error('La pregunta no está asociada a este formulario');

    // Eliminar
    await this.repo.removeQuestion(formularioId, preguntaId);

    // Opcional: reordenar los ordenes para mantener consecutividad
    // Implementación en repository: renumerar los ordenes después de borrar
  }
}
