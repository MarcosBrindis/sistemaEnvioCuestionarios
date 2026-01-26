import { GroupMemberRepository } from '../../domain/port/groupMemberRepository';

export class RemoveMemberFromGroup {
  constructor(private memberRepo: GroupMemberRepository) {}
  async execute(id_grupo: number, id_egresado: number): Promise<void> {
    await this.memberRepo.removeMember(id_grupo, id_egresado);
  }
}
