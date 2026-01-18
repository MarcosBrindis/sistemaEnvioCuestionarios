import { TipoCorreoRepository } from '../../domain/port/tipoCorreoRepository';


export class GetTiposCorreo {
  constructor(private repo: TipoCorreoRepository) {}
  async execute() {
    return this.repo.findAll();
  }
}

export class GetTipoCorreoById {
  constructor(private repo: TipoCorreoRepository) {}
  async execute(id: number) {
    return this.repo.findById(id);
  }
}
