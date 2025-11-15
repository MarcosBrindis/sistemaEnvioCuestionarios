import { FormularioRepository } from '../../domain/port/formRepository';

export class DeleteFormulario {
  constructor(private repo: FormularioRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error('El formulario no existe');

    // No se puede eliminar si está asociado a encuestas en uso
    const hasEncuesta = await this.repo.formHasEncuestaActive(id);
    if (hasEncuesta) {
      throw new Error('No se puede eliminar el formulario porque está asociado a encuestas en uso');
    }

    await this.repo.delete(id);
  }
}
