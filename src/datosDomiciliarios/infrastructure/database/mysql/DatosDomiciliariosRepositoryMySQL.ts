import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { DatosDomiciliariosRepository } from '../../../domain/port/DatosDomiciliariosRepository';
import { DatosDomiciliarios, CreateDatosDomiciliariosDTO, UpdateDatosDomiciliariosDTO } from '../../../domain/model/datosDomiciliarios';

export class DatosDomiciliariosRepositoryMySQL implements DatosDomiciliariosRepository {
  
  async create(datos: CreateDatosDomiciliariosDTO): Promise<DatosDomiciliarios> {
    const sql = `
      INSERT INTO datos_domiciliarios 
      (calle, colonia, numero_exterior, codigo_postal, estado, ciudad, id_egresado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const valores = [
      datos.calle,
      datos.colonia,
      datos.numero_exterior,
      datos.codigo_postal,
      datos.estado,
      datos.ciudad,
      datos.id_egresado
    ];

    await MysqlConnection.execute(sql, valores);
    
    const created = await this.getByEgresadoId(datos.id_egresado);
    if (!created) {
      throw new Error('Error al crear los datos domiciliarios');
    }
    
    return created;
  }

  async getByEgresadoId(idEgresado: number): Promise<DatosDomiciliarios | null> {
    const sql = `
      SELECT 
        id_datos_domiciliarios,
        calle,
        colonia,
        numero_exterior,
        codigo_postal,
        estado,
        ciudad,
        id_egresado,
        fecha_creacion,
        fecha_actualizacion
      FROM datos_domiciliarios
      WHERE id_egresado = ?
    `;

    const [rows]: any = await MysqlConnection.execute(sql, [idEgresado]);
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0] as DatosDomiciliarios;
  }

  async update(idEgresado: number, datos: UpdateDatosDomiciliariosDTO): Promise<DatosDomiciliarios> {
    const campos: string[] = [];
    const valores: any[] = [];

    if (datos.calle !== undefined) {
      campos.push('calle = ?');
      valores.push(datos.calle);
    }
    if (datos.colonia !== undefined) {
      campos.push('colonia = ?');
      valores.push(datos.colonia);
    }
    if (datos.numero_exterior !== undefined) {
      campos.push('numero_exterior = ?');
      valores.push(datos.numero_exterior);
    }
    if (datos.codigo_postal !== undefined) {
      campos.push('codigo_postal = ?');
      valores.push(datos.codigo_postal);
    }
    if (datos.estado !== undefined) {
      campos.push('estado = ?');
      valores.push(datos.estado);
    }
    if (datos.ciudad !== undefined) {
      campos.push('ciudad = ?');
      valores.push(datos.ciudad);
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    valores.push(idEgresado);
    const sql = `UPDATE datos_domiciliarios SET ${campos.join(', ')} WHERE id_egresado = ?`;
    
    await MysqlConnection.execute(sql, valores);

    const updated = await this.getByEgresadoId(idEgresado);
    if (!updated) {
      throw new Error('Error al actualizar los datos domiciliarios');
    }

    return updated;
  }

  async delete(idEgresado: number): Promise<boolean> {
    const sql = `DELETE FROM datos_domiciliarios WHERE id_egresado = ?`;
    const [result]: any = await MysqlConnection.execute(sql, [idEgresado]);
    
    return result.affectedRows > 0;
  }

  async existsByEgresadoId(idEgresado: number): Promise<boolean> {
    const sql = `SELECT COUNT(*) as count FROM datos_domiciliarios WHERE id_egresado = ?`;
    const [rows]: any = await MysqlConnection.execute(sql, [idEgresado]);
    
    return rows[0].count > 0;
  }
}
