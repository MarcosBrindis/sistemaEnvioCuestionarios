import { TipoCorreoRepository } from '../../domain/port/tipoCorreoRepository';

export class DeleteTipoCorreo {
  constructor(private repo: TipoCorreoRepository) {}

  async execute(id: number) {
    if (await this.repo.isUsedInTemplates(id)) {
      throw new Error('No se puede eliminar porque ya se usó en una plantilla');
    }
    await this.repo.delete(id);
    return { eliminado: true };
  }
}
