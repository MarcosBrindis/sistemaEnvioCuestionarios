import { BajaCorreoRepository } from '../../domain/port/bajaCorreoRepository';
import { EgresadoRepository } from '../../domain/port/egresadoRepository';

export class ResubscribeEgresado {
  constructor(
    private egresadoRepo: EgresadoRepository,
    private bajaCorreoRepo: BajaCorreoRepository
  ) {}

  async execute(id_egresado: number): Promise<{ is_active: boolean; estado_actual: string; }> {
    // 1. Reactivar egresado
    await this.egresadoRepo.setActivo(id_egresado, true);
    // 2. Eliminar registro de baja
    await this.bajaCorreoRepo.eliminarBaja(id_egresado);
    return {
      is_active: true,
      estado_actual: 'activo',
    };
  }
}
