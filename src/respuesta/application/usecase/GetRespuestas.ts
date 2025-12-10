import { Respuesta } from '../../domain/model/respuesta';
import { RespuestaRepository } from '../../domain/port/respuestaRepository';

export class ListarRespuestas {
  constructor(private respuestaRepo: RespuestaRepository) {}

  async execute(filters?: { id_encuesta?: number; id_egresado?: number }): Promise<Respuesta[]> {
    return this.respuestaRepo.findAll(filters);
  }
}
