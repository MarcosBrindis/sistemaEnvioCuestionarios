import { GroupMember } from '../../../domain/model/groupMember';
import { GroupMemberRepository } from '../../../domain/port/groupMemberRepository';
import { MysqlConnection as db } from '../../../../core/db/mysl/connection';

export class GroupMemberRepositoryMySQL implements GroupMemberRepository {
  async addMembers(id_grupo: number, ids_egresado: number[]): Promise<void> {
    if (!ids_egresado.length) return;
    const values = ids_egresado.map(id => `(${id_grupo},${id})`).join(',');
    await db.query(`INSERT IGNORE INTO grupo_miembro (id_grupo, id_egresado) VALUES ${values}`);
  }

  async removeMember(id_grupo: number, id_egresado: number): Promise<void> {
    await db.query('DELETE FROM grupo_miembro WHERE id_grupo = ? AND id_egresado = ?', [id_grupo, id_egresado]);
  }

  async listMembers(id_grupo: number): Promise<GroupMember[]> {
    const [rows]: any = await db.query('SELECT * FROM grupo_miembro WHERE id_grupo = ?', [id_grupo]);
    return rows;
  }

  async existsMember(id_grupo: number, id_egresado: number): Promise<boolean> {
    const [rows]: any = await db.query('SELECT COUNT(*) as count FROM grupo_miembro WHERE id_grupo = ? AND id_egresado = ?', [id_grupo, id_egresado]);
    return rows[0].count > 0;
  }
}
