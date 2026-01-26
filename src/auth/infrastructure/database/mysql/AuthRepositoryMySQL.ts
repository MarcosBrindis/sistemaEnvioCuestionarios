import { AuthRepository } from '../../../domain/port/authRepository';
import { Egresado } from '../../../../egresado/domain/model/egresado';
import { MysqlConnection } from '../../../../core/db/mysl/connection';

export class AuthRepositoryMySQL implements AuthRepository {
  async validateCredentials(matricula: string, curp: string): Promise<Egresado | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM egresado WHERE matricula = ? AND curp = ? AND is_active = TRUE LIMIT 1`,
      [matricula, curp]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
