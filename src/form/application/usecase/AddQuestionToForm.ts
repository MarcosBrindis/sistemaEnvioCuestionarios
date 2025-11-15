import { FormularioRepository } from '../../domain/port/formRepository';

export class AddQuestionToFormulario {
  constructor(private repo: FormularioRepository) {}

  async execute(formularioId: number, preguntaId: number, orden: number): Promise<void> {
    const formulario = await this.repo.findById(formularioId);
    if (!formulario) throw new Error('El formulario especificado no existe');

    const preguntaExists = await this.repo.preguntaExists(preguntaId);
    if (!preguntaExists) throw new Error('La pregunta especificada no existe');

    if (!Number.isInteger(orden) || orden <= 0) {
      throw new Error('El campo orden debe ser un número entero mayor que 0');
    }

    // No permitir misma pregunta más de una vez en el mismo formulario
    const associated = await this.repo.isQuestionAssociated(formularioId, preguntaId);
    if (associated) throw new Error('La pregunta ya está asociada a este formulario');

    // No permitir orden duplicado dentro del mismo formulario
    const duplicateOrder = await this.repo.hasDuplicateOrder(formularioId, orden);
    if (duplicateOrder) throw new Error('Ya existe una pregunta con el mismo orden en este formulario');

    const maxOrder = await this.repo.getMaxOrder(formularioId);
    const expected = (maxOrder ?? 0) + 1;
    if (orden !== expected) {
      throw new Error(`El orden debe ser consecutivo. El siguiente orden disponible es ${expected}`);
    }

    await this.repo.addQuestion(formularioId, preguntaId, orden);
  }
}
