import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { BaseEgresadoRepository } from './BaseEgresadoRepository';
import { Egresado, EstadoEgresadoCatalogo } from '../../../domain/model/egresado';

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

  async updateEstado(id: number, idEstado: number): Promise<Egresado> {
    await MysqlConnection.execute(
      `UPDATE egresado SET id_estado = ? WHERE id_egresado = ?`,
      [idEstado, id]
    );
    const actualizado = await this.findById(id);
    if (!actualizado) throw new Error('Egresado no encontrado tras actualizar estado');
    return actualizado;
  }

  async updatePerfilCompleto(
    id: number,
    data: Partial<Pick<Egresado, 'nombre' | 'primer_apellido' | 'segundo_apellido' | 'email' | 'fecha_nacimiento' | 'imagen_egresado' | 'id_programa_educativo' | 'id_periodo' | 'id_estado' | 'sinopsis'>>
  ): Promise<Egresado> {
    const campos: string[] = [];
    const valores: any[] = [];
    
    if (data.nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(data.nombre);
    }
    if (data.primer_apellido !== undefined) {
      campos.push('primer_apellido = ?');
      valores.push(data.primer_apellido);
    }
    if (data.segundo_apellido !== undefined) {
      campos.push('segundo_apellido = ?');
      valores.push(data.segundo_apellido);
    }
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
    if (data.sinopsis !== undefined) {
      campos.push('sinopsis = ?');
      valores.push(data.sinopsis);
    }
    if (data.id_programa_educativo !== undefined) {
      campos.push('id_programa_educativo = ?');
      valores.push(data.id_programa_educativo);
    }
    if (data.id_periodo !== undefined) {
      campos.push('id_periodo = ?');
      valores.push(data.id_periodo);
    }
    if (data.id_estado !== undefined) {
      campos.push('id_estado = ?');
      valores.push(data.id_estado);
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

  async getEstados(): Promise<EstadoEgresadoCatalogo[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT id_estado, nombre, descripcion FROM estado_egresado ORDER BY id_estado`
    );
    return rows;
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

  async updatePeriodoByMatricula(matricula: string, id_periodo: number): Promise<boolean> {
    const [result]: any = await MysqlConnection.execute(
      `UPDATE egresado SET id_periodo = ? WHERE matricula = ? AND id_periodo IS NULL`,
      [id_periodo, matricula]
    );
    return (result as any).affectedRows > 0;
  }

  async findEgresadosSinPeriodo(): Promise<Egresado[]> {
    const [rows]: any = await MysqlConnection.execute(
      `SELECT * FROM egresado WHERE id_periodo IS NULL`
    );
    return rows;
  }

  async buscarEgresadosAvanzado(filtros: {
    id_programa_educativo?: number;
    id_periodo_egreso?: number;
    cohorte?: number;
    prefijo_matricula?: string; // Ejemplo: '113' (3 primeros dígitos de matrícula)
    busqueda?: string;
  }): Promise<any[]> {
    let sql = `SELECT e.*, p.cohorte AS cohorte_egreso, pe.nombre AS programa_educativo
      FROM egresado e
      LEFT JOIN periodo_graduado p ON e.id_periodo = p.id_periodo
      LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo
      WHERE 1=1`;
    const params: any[] = [];
    if (filtros.id_programa_educativo) {
      sql += ' AND e.id_programa_educativo = ?';
      params.push(filtros.id_programa_educativo);
    }
    if (filtros.id_periodo_egreso) {
      sql += ' AND e.id_periodo = ?';
      params.push(filtros.id_periodo_egreso);
    }
    if (filtros.cohorte) {
      sql += ' AND p.cohorte = ?';
      params.push(String(filtros.cohorte));
    }
    if (filtros.prefijo_matricula) {
      sql += ' AND e.matricula LIKE ?';
      params.push(`${filtros.prefijo_matricula}%`);
    }
    if (filtros.busqueda) {
      sql += ` AND (e.nombre LIKE ? OR e.primer_apellido LIKE ? OR e.segundo_apellido LIKE ? OR e.matricula LIKE ? OR e.email LIKE ? OR pe.nombre LIKE ?)`;
      const search = `%${filtros.busqueda}%`;
      params.push(search, search, search, search, search, search);
    }
    const [rows]: any = await MysqlConnection.execute(sql, params);
    return rows.map((row: any) => ({
      ...row,
      programa_educativo: row.programa_educativo ?? row.nombre_programa_educativo ?? null
    }));
  }
}