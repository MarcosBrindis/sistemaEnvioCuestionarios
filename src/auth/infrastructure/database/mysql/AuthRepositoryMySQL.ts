import { AuthRepository } from '../../../domain/port/authRepository';
import { Egresado } from '../../../../egresado/domain/model/egresado';
import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { InternalUserAuth } from '../../../domain/model/internalUser';

export class AuthRepositoryMySQL implements AuthRepository {
  async validateEgresadoCredentials(curp: string): Promise<Egresado | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM egresado WHERE curp = ? AND is_active = TRUE LIMIT 1`,
      [curp]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async validateInternalCredentials(email: string): Promise<InternalUserAuth | null> {
    const [rows]: any = await MysqlConnection.execute(
      `
        SELECT
          u.id_usuario,
          u.nombre,
          u.email,
          u.password_hash,
          r.nombre AS rol
        FROM usuario_interno u
        INNER JOIN cat_rol_usuario r ON r.id_rol = u.id_rol
        WHERE u.email = ?
          AND u.is_active = TRUE
        LIMIT 1
      `,
      [email]
    );

    return rows.length > 0 ? rows[0] : null;
  }
}
