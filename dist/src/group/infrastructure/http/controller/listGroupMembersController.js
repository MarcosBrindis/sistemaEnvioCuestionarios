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
exports.listGroupMembersController = void 0;
const dependencies_1 = require("../../dependencies");
const ListGroupMembers_1 = require("../../../application/usecase/ListGroupMembers");
const listGroupMembersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const usecase = new ListGroupMembers_1.ListGroupMembers(dependencies_1.groupMemberRepository);
        const miembros = yield usecase.execute(id);
        res.status(200).json({
            data: miembros.map(m => ({
                type: 'miembros-grupo',
                id: `${m.id_grupo}-${m.id_egresado}`,
                attributes: {
                    id_grupo: m.id_grupo,
                    id_egresado: m.id_egresado
                }
            }))
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.listGroupMembersController = listGroupMembersController;
