import { GroupMember } from '../model/groupMember';

export interface GroupMemberRepository {
  addMembers(id_grupo: number, ids_egresado: number[]): Promise<void>;
  removeMember(id_grupo: number, id_egresado: number): Promise<void>;
  listMembers(id_grupo: number): Promise<GroupMember[]>;
  existsMember(id_grupo: number, id_egresado: number): Promise<boolean>;
}
