import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { TipoCorreo } from '../../../domain/model/tipoCorreo';
import { TipoCorreoRepository } from '../../../domain/port/tipoCorreoRepository';

export class TipoCorreoRepositoryMySQL implements TipoCorreoRepository {
    async findById(id: number): Promise<TipoCorreo | null> {
      const [rows]: any = await MysqlConnection.execute(
        'SELECT * FROM tipo_correo WHERE id_tipo_correo = ?',
        [id]
      );
      if (rows.length === 0) return null;
      return rows[0];
    }
  async create(tipo: string): Promise<TipoCorreo> {
    const [result]: any = await MysqlConnection.execute(
      'INSERT INTO tipo_correo (tipo) VALUES (?)',
      [tipo]
    );
    return {
      id_tipo_correo: result.insertId,
      tipo
    };
  }

  async findAll(): Promise<TipoCorreo[]> {
    const [rows]: any = await MysqlConnection.execute(
      'SELECT * FROM tipo_correo ORDER BY tipo'
    );
    return rows;
  }

  async update(id: number, tipo: string): Promise<TipoCorreo> {
    await MysqlConnection.execute(
      'UPDATE tipo_correo SET tipo = ? WHERE id_tipo_correo = ?',
      [tipo, id]
    );
    return { id_tipo_correo: id, tipo };
  }

  async delete(id: number): Promise<void> {
    await MysqlConnection.execute(
      'DELETE FROM tipo_correo WHERE id_tipo_correo = ?',
      [id]
    );
  }

  async existsByTipo(tipo: string): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      'SELECT COUNT(*) as count FROM tipo_correo WHERE tipo = ?',
      [tipo]
    );
    return rows[0].count > 0;
  }

  async isUsedInTemplates(id: number): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      'SELECT COUNT(*) as count FROM template_correo WHERE id_tipo_correo = ?',
      [id]
    );
    return rows[0].count > 0;
  }
}
