import { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import {
  InternalUser,
  CreateInternalUserInput,
  UpdateInternalUserInput,
} from '../../domain/model/InternalUser';
import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export class UsuariosInternosRepositoryMySQL implements IUsuariosInternosRepository {
  constructor(private readonly pool: Pool) {}

  async createUser(data: CreateInternalUserInput): Promise<{ id_usuario: number }> {
    const connection = await this.pool.getConnection();
    try {
      // Validar que el email no exista
      const [existingUser] = await connection.query(
        'SELECT id_usuario FROM usuario_interno WHERE email = ?',
        [data.email]
      );
      if ((existingUser as any[]).length > 0) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const password_hash = await bcrypt.hash(data.password, 10);

      // Validar que id_rol exista
      const [roleExists] = await connection.query(
        'SELECT id_rol FROM cat_rol_usuario WHERE id_rol = ?',
        [data.id_rol]
      );
      if ((roleExists as any[]).length === 0) {
        throw new Error('Rol inválido');
      }

      // Insertar usuario
      const [result] = await connection.query(
        `INSERT INTO usuario_interno (nombre, email, password_hash, id_rol, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
        [data.nombre, data.email, password_hash, data.id_rol]
      );

      const insertResult = result as any;
      return { id_usuario: insertResult.insertId };
    } finally {
      connection.release();
    }
  }

  async getUsers(filters?: {
    id_rol?: number;
    is_active?: boolean;
    search?: string;
  }): Promise<InternalUser[]> {
    let query = `
      SELECT 
        ui.id_usuario,
        ui.nombre,
        ui.email,
        ui.id_rol,
        cru.nombre as rol_nombre,
        ui.is_active,
        ui.created_at,
        ui.updated_at
      FROM usuario_interno ui
      JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.id_rol !== undefined) {
      query += ' AND ui.id_rol = ?';
      params.push(filters.id_rol);
    }

    if (filters?.is_active !== undefined) {
      query += ' AND ui.is_active = ?';
      params.push(filters.is_active ? 1 : 0);
    }

    if (filters?.search) {
      query += ' AND (ui.nombre LIKE ? OR ui.email LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY ui.created_at DESC';

    const [rows] = await this.pool.query(query, params);
    return this.mapRows(rows as any[]);
  }

  async getUserById(id_usuario: number): Promise<InternalUser | null> {
    const [rows] = await this.pool.query(
      `SELECT 
        ui.id_usuario,
        ui.nombre,
        ui.email,
        ui.id_rol,
        cru.nombre as rol_nombre,
        ui.is_active,
        ui.created_at,
        ui.updated_at
      FROM usuario_interno ui
      JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
      WHERE ui.id_usuario = ?`,
      [id_usuario]
    );

    const results = rows as any[];
    if (results.length === 0) return null;

    return this.mapRows(results)[0];
  }

  async getUserByEmail(email: string): Promise<InternalUser | null> {
    const [rows] = await this.pool.query(
      `SELECT 
        ui.id_usuario,
        ui.nombre,
        ui.email,
        ui.id_rol,
        cru.nombre as rol_nombre,
        ui.is_active,
        ui.created_at,
        ui.updated_at
      FROM usuario_interno ui
      JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
      WHERE ui.email = ?`,
      [email]
    );

    const results = rows as any[];
    if (results.length === 0) return null;

    return this.mapRows(results)[0];
  }

  async getRoles(): Promise<
    Array<{
      id_rol: number;
      nombre: string;
    }>
  > {
    const [rows] = await this.pool.query(
      `SELECT id_rol, nombre
       FROM cat_rol_usuario
       ORDER BY id_rol ASC`
    );

    return rows as Array<{
      id_rol: number;
      nombre: string;
    }>;
  }

  async updateUser(id_usuario: number, data: UpdateInternalUserInput): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const updates: string[] = [];
      const params: any[] = [];

      if (data.nombre !== undefined) {
        updates.push('nombre = ?');
        params.push(data.nombre);
      }

      if (data.email !== undefined) {
        // Validar que el email no esté en uso por otro usuario
        const [existingUser] = await connection.query(
          'SELECT id_usuario FROM usuario_interno WHERE email = ? AND id_usuario != ?',
          [data.email, id_usuario]
        );
        if ((existingUser as any[]).length > 0) {
          throw new Error('El email ya está en uso');
        }
        updates.push('email = ?');
        params.push(data.email);
      }

      if (data.id_rol !== undefined) {
        // Validar que id_rol exista
        const [roleExists] = await connection.query(
          'SELECT id_rol FROM cat_rol_usuario WHERE id_rol = ?',
          [data.id_rol]
        );
        if ((roleExists as any[]).length === 0) {
          throw new Error('Rol inválido');
        }
        updates.push('id_rol = ?');
        params.push(data.id_rol);
      }

      if (data.is_active !== undefined) {
        updates.push('is_active = ?');
        params.push(data.is_active ? 1 : 0);
      }

      if (updates.length === 0) return true;

      updates.push('updated_at = NOW()');
      params.push(id_usuario);

      const query = `UPDATE usuario_interno SET ${updates.join(', ')} WHERE id_usuario = ?`;
      await connection.query(query, params);

      return true;
    } finally {
      connection.release();
    }
  }

  async changePassword(id_usuario: number, password_hash: string): Promise<boolean> {
    const [result] = await this.pool.query(
      'UPDATE usuario_interno SET password_hash = ?, updated_at = NOW() WHERE id_usuario = ?',
      [password_hash, id_usuario]
    );

    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  }

  async deactivateUser(id_usuario: number): Promise<boolean> {
    const [result] = await this.pool.query(
      'UPDATE usuario_interno SET is_active = 0, updated_at = NOW() WHERE id_usuario = ?',
      [id_usuario]
    );

    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  }

  async assignPrograms(id_usuario: number, id_programas: number[]): Promise<boolean> {
    if (id_programas.length === 0) return true;

    const connection = await this.pool.getConnection();
    try {
      const [userRoleResult] = await connection.query(
        `SELECT cru.nombre FROM usuario_interno ui
         JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
         WHERE ui.id_usuario = ?`,
        [id_usuario]
      );

      const userRoles = userRoleResult as any[];
      if (userRoles.length === 0) throw new Error('Usuario no encontrado');

      const rolNombre = userRoles[0].nombre;

      if (rolNombre !== 'director_programa_educativo') {
        throw new Error('Solo los directores de programa pueden tener asignaciones');
      }

      await connection.query('DELETE FROM usuario_programa_educativo WHERE id_usuario = ?', [
        id_usuario,
      ]);

      for (const id_programa of id_programas) {
        const [programExists] = await connection.query(
          'SELECT id_programa_educativo FROM programa_educativo WHERE id_programa_educativo = ?',
          [id_programa]
        );

        if ((programExists as any[]).length === 0) {
          throw new Error(`Programa ${id_programa} no existe`);
        }

        await connection.query(
          'INSERT INTO usuario_programa_educativo (id_usuario, id_programa_educativo) VALUES (?, ?)',
          [id_usuario, id_programa]
        );
      }

      return true;
    } finally {
      connection.release();
    }
  }

  async unassignProgram(id_usuario: number, id_programa: number): Promise<boolean> {
    const [result] = await this.pool.query(
      'DELETE FROM usuario_programa_educativo WHERE id_usuario = ? AND id_programa_educativo = ?',
      [id_usuario, id_programa]
    );

    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  async getUserPrograms(id_usuario: number): Promise<
    Array<{
      id_programa: number;
      nombre_programa: string;
    }>
  > {
    const [rows] = await this.pool.query(
      `SELECT 
        upe.id_programa_educativo as id_programa,
        pe.nombre as nombre_programa
      FROM usuario_programa_educativo upe
      JOIN programa_educativo pe ON upe.id_programa_educativo = pe.id_programa_educativo
      WHERE upe.id_usuario = ?
      ORDER BY pe.nombre`,
      [id_usuario]
    );

    return rows as any[];
  }

  private mapRows(rows: any[]): InternalUser[] {
    return rows.map((row) => ({
      id_usuario: row.id_usuario,
      nombre: row.nombre,
      email: row.email,
      id_rol: row.id_rol,
      rol_nombre: row.rol_nombre,
      is_active: Boolean(row.is_active),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }
}
