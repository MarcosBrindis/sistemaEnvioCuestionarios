import { Respuesta } from '../../domain/model/respuesta';
import { RespuestaRepository } from '../../domain/port/respuestaRepository';

export class ObtenerRespuestaPorId {
  constructor(private respuestaRepo: RespuestaRepository) {}

  async execute(id: number): Promise<Respuesta | null> {
    return this.respuestaRepo.findById(id);
  }
}
