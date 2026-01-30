import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { Egresado } from '../../domain/model/egresado';

export interface UpdateEstadoEgresadoDTO {
  id: number;
  id_estado: number;
}

export class UpdateEstadoEgresado {
  constructor(private egresadoRepository: EgresadoRepository) {}

  async execute(dto: UpdateEstadoEgresadoDTO): Promise<Egresado> {
    // Verificar que el egresado existe
    const egresado = await this.egresadoRepository.findById(dto.id);
    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }

    if (![1, 2, 3].includes(dto.id_estado)) {
      throw new Error('Estado de egresado inválido. Los valores válidos son: 1 (pendiente), 2 (rechazado), 3 (aprobado)');
    }

    const egresadoActualizado = await this.egresadoRepository.updateEstado(dto.id, dto.id_estado);
    return egresadoActualizado;
  }
}
