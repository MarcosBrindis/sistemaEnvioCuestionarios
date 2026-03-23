"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupByIdController = void 0;
const dependencies_1 = require("../../dependencies");
const GetGroupById_1 = require("../../../application/usecase/GetGroupById");
const ListGroupMembers_1 = require("../../../application/usecase/ListGroupMembers");
const dependencies_2 = require("../../dependencies");
const getGroupByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const usecase = new GetGroupById_1.GetGroupById(dependencies_1.groupRepository);
        const group = yield usecase.execute(id);
        if (!group)
            return res.status(404).json({ error: 'Grupo no encontrado' });
        const membersUsecase = new ListGroupMembers_1.ListGroupMembers(dependencies_2.groupMemberRepository);
        const miembros = yield membersUsecase.execute(id);
        res.json({
            data: {
                type: 'grupos',
                id: String(group.id_grupo),
                attributes: {
                    name: group.nombre,
                    descripcion: group.descripcion,
                },
                relationships: {
                    miembros: miembros.map(m => ({ type: 'egresados', id: String(m.id_egresado) }))
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getGroupByIdController = getGroupByIdController;
