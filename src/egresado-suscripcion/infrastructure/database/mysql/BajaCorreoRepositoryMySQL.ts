import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BajaCorreo } from '../../../domain/model/bajaCorreo';
import { BajaCorreoRepository } from '../../../domain/port/bajaCorreoRepository';

export class BajaCorreoRepositoryMySQL implements BajaCorreoRepository {
  async registrarBaja(id_egresado: number, motivo: string): Promise<BajaCorreo> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO baja_correo (id_egresado, motivo, fecha_baja) VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE motivo = VALUES(motivo), fecha_baja = NOW()`,
      [id_egresado, motivo]
    );
    return {
      id_baja: result.insertId,
      id_egresado,
      motivo,
      fecha_baja: new Date(),
    };
  }

  async eliminarBaja(id_egresado: number): Promise<void> {
    await MysqlConnection.execute(
      `DELETE FROM baja_correo WHERE id_egresado = ?`,
      [id_egresado]
    );
  }

  async existeBaja(id_egresado: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM baja_correo WHERE id_egresado = ?`,
      [id_egresado]
    );
    return rows[0].count > 0;
  }
}
