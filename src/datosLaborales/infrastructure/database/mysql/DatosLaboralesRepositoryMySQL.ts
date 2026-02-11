import { MysqlConnection } from '../../../../core/db/mysl/connection';
import { DatosLaboralesRepository } from '../../../domain/port/DatosLaboralesRepository';
import { DatosLaborales, CreateDatosLaboralesDTO, UpdateDatosLaboralesDTO } from '../../../domain/model/datosLaborales';

export class DatosLaboralesRepositoryMySQL implements DatosLaboralesRepository {
  
  async create(datos: CreateDatosLaboralesDTO): Promise<DatosLaborales> {
    const sql = `
      INSERT INTO datos_laborales 
      (trabaja_actualmente, nombre_empresa, puesto, id_sector, actividad_principal, id_egresado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const valores = [
      datos.trabaja_actualmente,
      datos.nombre_empresa || null,
      datos.puesto || null,
      datos.id_sector || null,
      datos.actividad_principal || null,
      datos.id_egresado
    ];

    await MysqlConnection.execute(sql, valores);
    
    const created = await this.getByEgresadoId(datos.id_egresado);
    if (!created) {
      throw new Error('Error al crear los datos laborales');
    }
    
    return created;
  }

  async getByEgresadoId(idEgresado: number): Promise<DatosLaborales | null> {
    const sql = `
      SELECT 
        id_datos_laborales,
        trabaja_actualmente,
        nombre_empresa,
        puesto,
        id_sector,
        actividad_principal,
        id_egresado,
        fecha_creacion,
        fecha_actualizacion
      FROM datos_laborales
      WHERE id_egresado = ?
    `;

    const [rows]: any = await MysqlConnection.execute(sql, [idEgresado]);
    
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id_datos_laborales: row.id_datos_laborales,
      trabaja_actualmente: Boolean(row.trabaja_actualmente),
      nombre_empresa: row.nombre_empresa,
      puesto: row.puesto,
      id_sector: row.id_sector,
      actividad_principal: row.actividad_principal,
      id_egresado: row.id_egresado,
      fecha_creacion: row.fecha_creacion,
      fecha_actualizacion: row.fecha_actualizacion
    } as DatosLaborales;
  }

  async update(idEgresado: number, datos: UpdateDatosLaboralesDTO): Promise<DatosLaborales> {
    const campos: string[] = [];
    const valores: any[] = [];

    if (datos.trabaja_actualmente !== undefined) {
      campos.push('trabaja_actualmente = ?');
      valores.push(datos.trabaja_actualmente);
    }
    if (datos.nombre_empresa !== undefined) {
      campos.push('nombre_empresa = ?');
      valores.push(datos.nombre_empresa);
    }
    if (datos.puesto !== undefined) {
      campos.push('puesto = ?');
      valores.push(datos.puesto);
    }
    if (datos.id_sector !== undefined) {
      campos.push('id_sector = ?');
      valores.push(datos.id_sector);
    }
    if (datos.actividad_principal !== undefined) {
      campos.push('actividad_principal = ?');
      valores.push(datos.actividad_principal);
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    valores.push(idEgresado);
    const sql = `UPDATE datos_laborales SET ${campos.join(', ')} WHERE id_egresado = ?`;
    
    await MysqlConnection.execute(sql, valores);

    const updated = await this.getByEgresadoId(idEgresado);
    if (!updated) {
      throw new Error('Error al actualizar los datos laborales');
    }

    return updated;
  }

  async delete(idEgresado: number): Promise<boolean> {
    const sql = `DELETE FROM datos_laborales WHERE id_egresado = ?`;
    const [result]: any = await MysqlConnection.execute(sql, [idEgresado]);
    
    return result.affectedRows > 0;
  }

  async existsByEgresadoId(idEgresado: number): Promise<boolean> {
    const sql = `SELECT COUNT(*) as count FROM datos_laborales WHERE id_egresado = ?`;
    const [rows]: any = await MysqlConnection.execute(sql, [idEgresado]);
    
    return rows[0].count > 0;
  }
}
