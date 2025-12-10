import { Group } from '../../../domain/model/group';
import { GroupRepository } from '../../../domain/port/groupRepository';
import { MysqlConnection as db } from '../../../../core/db/mysl/connection';

export class GroupRepositoryMySQL implements GroupRepository {
  async create(data: Omit<Group, 'id_grupo'>): Promise<Group> {
    const [result]: any = await db.query(
      'INSERT INTO grupo_egresado (nombre, descripcion) VALUES (?, ?)',
      [data.nombre, data.descripcion]
    );
    return {
      id_grupo: result.insertId,
      ...data,
    };
  }

  async findAll(): Promise<Group[]> {
    const [rows]: any = await db.query('SELECT * FROM grupo_egresado');
    return rows;
  }

  async findById(id: number): Promise<Group | null> {
    const [rows]: any = await db.query('SELECT * FROM grupo_egresado WHERE id_grupo = ?', [id]);
    return rows[0] || null;
  }

  async update(id: number, data: Partial<Omit<Group, 'id_grupo'>>): Promise<Group | null> {
    await db.query('UPDATE grupo_egresado SET nombre = ?, descripcion = ? WHERE id_grupo = ?', [data.nombre, data.descripcion, id]);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await db.query('DELETE FROM grupo_egresado WHERE id_grupo = ?', [id]);
  }

  async existsByName(nombre: string): Promise<boolean> {
    const [rows]: any = await db.query('SELECT COUNT(*) as count FROM grupo_egresado WHERE nombre = ?', [nombre]);
    return rows[0].count > 0;
  }
}
