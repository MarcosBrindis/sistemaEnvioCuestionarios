import { GroupMemberRepository } from '../../domain/port/groupMemberRepository';
import { EgresadoRepository } from '../../../egresado/domain/port/egresadoRepository';

export class AddMembersToGroup {
  constructor(private memberRepo: GroupMemberRepository, private egresadoRepo: EgresadoRepository) {}
  async execute(id_grupo: number, ids_egresado: number[]): Promise<void> {
    const egresados = await Promise.all(ids_egresado.map(id => this.egresadoRepo.findById(id)));
    const activos = egresados.filter(e => e && e.is_active);
    if (activos.length !== ids_egresado.length) {
      throw new Error('Uno o más egresados no existen o no están activos');
    }
    await this.memberRepo.addMembers(id_grupo, ids_egresado);
  }
}
