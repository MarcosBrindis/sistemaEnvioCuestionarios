import { TipoCorreoRepository } from '../../domain/port/tipoCorreoRepository';

export class UpdateTipoCorreo {
  constructor(private repo: TipoCorreoRepository) {}

  async execute(id: number, tipo: string) {
    if (!tipo || !tipo.trim()) {
      throw new Error('El campo tipo es obligatorio');
    }
    if (await this.repo.existsByTipo(tipo)) {
      throw new Error('El tipo de correo ya existe');
    }
    return this.repo.update(id, tipo.trim());
  }
}
