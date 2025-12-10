import { Respuesta } from '../../domain/model/respuesta';
import { RespuestaRepository } from '../../domain/port/respuestaRepository';

export class RegistrarRespuesta {
  constructor(private respuestaRepo: RespuestaRepository) {}

  async execute(data: Omit<Respuesta, 'id_respuesta' | 'fecha_respuesta'>): Promise<Respuesta> {
      const exists = await this.respuestaRepo.existsByEgresadoAndFormulario(data.id_egresado, data.id_formulario);
      if (exists) {
        throw new Error('El egresado ya respondió este formulario.');
    }
      const respuesta = await this.respuestaRepo.create({
        id_egresado: data.id_egresado,
        id_formulario: data.id_formulario,
        respuestas_json: data.respuestas_json,
      });
      return respuesta;
  }
}
