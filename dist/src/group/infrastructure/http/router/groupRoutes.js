"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createGroupController_1 = require("../controller/createGroupController");
const getGroupsController_1 = require("../controller/getGroupsController");
const getGroupByIdController_1 = require("../controller/getGroupByIdController");
const updateGroupController_1 = require("../controller/updateGroupController");
const deleteGroupController_1 = require("../controller/deleteGroupController");
const addMembersToGroupController_1 = require("../controller/addMembersToGroupController");
const removeMemberFromGroupController_1 = require("../controller/removeMemberFromGroupController");
const listGroupMembersController_1 = require("../controller/listGroupMembersController");
const router = (0, express_1.Router)();
// CRUD grupos
router.post('/', createGroupController_1.createGroupController);
router.get('/', getGroupsController_1.getGroupsController);
router.get('/:id', getGroupByIdController_1.getGroupByIdController);
router.patch('/:id', updateGroupController_1.updateGroupController);
router.delete('/:id', deleteGroupController_1.deleteGroupController);
// Gestión de miembros
router.post('/:id/members', addMembersToGroupController_1.addMembersToGroupController); // body: { data: { type: 'miembros-grupo', attributes: { ids_graduados: [1,2,3] } } }
router.get('/:id/members', listGroupMembersController_1.listGroupMembersController);
router.delete('/:id/members/:idEgresado', removeMemberFromGroupController_1.removeMemberFromGroupController);
exports.default = router;
