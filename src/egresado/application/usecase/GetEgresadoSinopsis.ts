import { EgresadoRepository } from '../../domain/port/egresadoRepository';

export class GetEgresadoSinopsis {
  constructor(private egresadoRepo: EgresadoRepository) {}

  async execute(idEgresado: number): Promise<{ sinopsis: string | null }> {
    const egresado = await this.egresadoRepo.findById(idEgresado);
    
    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }

    return {
      sinopsis: egresado.sinopsis
    };
  }
}
