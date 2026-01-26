import { BajaCorreoRepository } from '../../domain/port/bajaCorreoRepository';
import { EgresadoRepository } from '../../domain/port/egresadoRepository';

export class UnsubscribeEgresado {
  constructor(
    private egresadoRepo: EgresadoRepository,
    private bajaCorreoRepo: BajaCorreoRepository
  ) {}

  async execute(id_egresado: number, motivo: string): Promise<{ is_active: boolean; estado_actual: string; } > {
    // Transacción lógica: registrar baja y desactivar egresado
    // 1. Registrar baja
    await this.bajaCorreoRepo.registrarBaja(id_egresado, motivo);
    // 2. Desactivar egresado
    await this.egresadoRepo.setActivo(id_egresado, false);
    return {
      is_active: false,
      estado_actual: 'baja',
    };
  }
}
