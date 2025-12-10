import { RespuestaRepository } from '../../domain/port/respuestaRepository';

export class EliminarRespuesta {
  constructor(private respuestaRepo: RespuestaRepository) {}

  async execute(id: number): Promise<void> {
    await this.respuestaRepo.delete(id);
  }
}
