import { GroupRepositoryMySQL } from './database/mysql/GroupRepositoryMySQL';
import { GroupMemberRepositoryMySQL } from './database/mysql/GroupMemberRepositoryMySQL';
import { CreateGroup } from '../application/usecase/CreateGroup';
import { GetGroups } from '../application/usecase/GetGroups';
import { GetGroupById } from '../application/usecase/GetGroupById';
import { UpdateGroup } from '../application/usecase/UpdateGroup';
import { DeleteGroup } from '../application/usecase/DeleteGroup';
import { AddMembersToGroup } from '../application/usecase/AddMembersToGroup';
import { RemoveMemberFromGroup } from '../application/usecase/RemoveMemberFromGroup';
import { ListGroupMembers } from '../application/usecase/ListGroupMembers';
import { egresadoRepository } from '../../egresado/infrastructure/dependencies';

export const groupRepository = new GroupRepositoryMySQL();
export const groupMemberRepository = new GroupMemberRepositoryMySQL();

export const createGroupUsecase = new CreateGroup(groupRepository);
export const getGroupsUsecase = new GetGroups(groupRepository);
export const getGroupByIdUsecase = new GetGroupById(groupRepository);
export const updateGroupUsecase = new UpdateGroup(groupRepository);
export const deleteGroupUsecase = new DeleteGroup(groupRepository);
export const addMembersToGroupUsecase = new AddMembersToGroup(groupMemberRepository, egresadoRepository);
export const removeMemberFromGroupUsecase = new RemoveMemberFromGroup(groupMemberRepository);
export const listGroupMembersUsecase = new ListGroupMembers(groupMemberRepository);
