import { GroupMemberRepository } from '../../domain/port/groupMemberRepository';

export class ListGroupMembers {
  constructor(private memberRepo: GroupMemberRepository) {}
  async execute(id_grupo: number) {
    return this.memberRepo.listMembers(id_grupo);
  }
}
