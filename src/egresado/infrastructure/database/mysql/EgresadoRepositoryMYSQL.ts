
import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseEgresadoRepository } from './BaseEgresadoRepository';
import { Egresado } from '../../../domain/model/egresado';

export class EgresadoRepositoryMySQL extends BaseEgresadoRepository {
  async updatePerfil(
    id: number,
    data: Partial<Pick<Egresado, 'email' | 'fecha_nacimiento' | 'imagen_egresado'>>
  ): Promise<Egresado> {
    const campos: string[] = [];
    const valores: any[] = [];
    if (data.email !== undefined) {
      campos.push('email = ?');
      valores.push(data.email);
    }
    if (data.fecha_nacimiento !== undefined) {
      campos.push('fecha_nacimiento = ?');
      valores.push(data.fecha_nacimiento);
    }
    if (data.imagen_egresado !== undefined) {
      campos.push('imagen_egresado = ?');
      valores.push(data.imagen_egresado);
    }
    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }
    valores.push(id);
    const sql = `UPDATE egresado SET ${campos.join(', ')} WHERE id_egresado = ?`;
    await MysqlConnection.execute(sql, valores);
    const actualizado = await this.findById(id);
    if (!actualizado) throw new Error('Egresado no encontrado tras actualizar');
    return actualizado;
  }
  async create(data: Omit<Egresado, 'id_egresado'>): Promise<Egresado> {
    const [result]: any = await MysqlConnection.execute(
      `INSERT INTO egresado (
        nombre, primer_apellido, segundo_apellido, matricula, 
        curp, email, imagen_egresado, fecha_nacimiento, 
        is_active, id_programa_educativo, id_periodo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.primer_apellido,
        data.segundo_apellido,
        data.matricula,
        data.curp,
        data.email,
        data.imagen_egresado,
        data.fecha_nacimiento,
        data.is_active,
        data.id_programa_educativo,
        data.id_periodo
      ]
    );
    
    const insertId = (result as any).insertId;
    return this.findById(insertId) as Promise<Egresado>;
  }

  async findByMatricula(matricula: string): Promise<Egresado | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM egresado WHERE matricula = ?`,
      [matricula]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll(): Promise<Egresado[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM egresado WHERE is_active = TRUE ORDER BY matricula`
    );
    return rows;
  }

  async existsByMatricula(matricula: string): Promise<boolean> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT COUNT(*) as count FROM egresado WHERE matricula = ?`,
      [matricula]
    );
    return rows[0].count > 0;
  }

  async batchCreate(egresados: Omit<Egresado, 'id_egresado'>[]): Promise<number> {
    if (egresados.length === 0) return 0;
    
    const valuesPlaceholders = egresados.map(() => 
      '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).join(', ');
    
    const values = egresados.flatMap(egresado => [
      egresado.nombre,
      egresado.primer_apellido,
      egresado.segundo_apellido,
      egresado.matricula,
      egresado.curp,
      egresado.email,
      egresado.imagen_egresado,
      egresado.fecha_nacimiento,
      egresado.is_active,
      egresado.id_programa_educativo,
      egresado.id_periodo
    ]);
    
    try {
      const [result]: any = await MysqlConnection.execute(
        `INSERT INTO egresado (
          nombre, primer_apellido, segundo_apellido, matricula, 
          curp, email, imagen_egresado, fecha_nacimiento, 
          is_active, id_programa_educativo, id_periodo
        ) VALUES ${valuesPlaceholders}`,
        values
      );
      
      return (result as any).affectedRows || 0;
    } catch (error) {
      const err = error as Error;
      console.error('Error en batch insert de egresados:', err);
      throw new Error(`Error en batch insert: ${err.message}`);
    }
  }

  async findById(id: number): Promise<Egresado | null> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM egresado WHERE id_egresado = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}