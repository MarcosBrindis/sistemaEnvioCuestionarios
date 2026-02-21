import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { Egresado } from '../../domain/model/egresado';

export class UpdateEgresadoSinopsis {
  constructor(private egresadoRepo: EgresadoRepository) {}

  async execute(
    idEgresado: number,
    data: {
      sinopsis?: string | null;
    }
  ): Promise<Egresado> {
    const egresado = await this.egresadoRepo.findById(idEgresado);
    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }

    if (data.sinopsis !== undefined && data.sinopsis !== null) {
      if (typeof data.sinopsis !== 'string' || data.sinopsis.trim() === '') {
        throw new Error('Sinopsis no puede estar vacía');
      }
    }

    const actualizado = await this.egresadoRepo.updatePerfilCompleto(idEgresado, {
      sinopsis: data.sinopsis,
    });

    return actualizado;
  }
}
