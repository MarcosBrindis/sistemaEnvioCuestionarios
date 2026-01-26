import { Router } from 'express';
import { createGroupController } from '../controller/createGroupController';
import { getGroupsController } from '../controller/getGroupsController';
import { getGroupByIdController } from '../controller/getGroupByIdController';
import { updateGroupController } from '../controller/updateGroupController';
import { deleteGroupController } from '../controller/deleteGroupController';
import { addMembersToGroupController } from '../controller/addMembersToGroupController';
import { removeMemberFromGroupController } from '../controller/removeMemberFromGroupController';
import { listGroupMembersController } from '../controller/listGroupMembersController';

const router = Router();

// CRUD grupos
router.post('/', createGroupController);
router.get('/', getGroupsController);
router.get('/:id', getGroupByIdController);
router.patch('/:id', updateGroupController);
router.delete('/:id', deleteGroupController);

// Gestión de miembros
router.post('/:id/members', addMembersToGroupController); // body: { data: { type: 'miembros-grupo', attributes: { ids_graduados: [1,2,3] } } }
router.get('/:id/members', listGroupMembersController);
router.delete('/:id/members/:idEgresado', removeMemberFromGroupController);

export default router;
