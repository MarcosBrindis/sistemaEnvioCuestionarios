import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { EgresadoRepository } from '../../../domain/port/egresadoRepository';

export class EgresadoRepositoryMySQL implements EgresadoRepository {
  async setActivo(id_egresado: number, activo: boolean): Promise<void> {
    await MysqlConnection.execute(
      `UPDATE egresado SET is_active = ? WHERE id_egresado = ?`,
      [activo ? 1 : 0, id_egresado]
    );
  }
}
