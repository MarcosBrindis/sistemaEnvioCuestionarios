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
exports.getGroupsController = void 0;
const dependencies_1 = require("../../dependencies");
const GetGroups_1 = require("../../../application/usecase/GetGroups");
const getGroupsController = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usecase = new GetGroups_1.GetGroups(dependencies_1.groupRepository);
        const list = yield usecase.execute();
        const data = list.map((g) => ({
            type: 'grupos',
            id: String(g.id_grupo),
            attributes: {
                name: g.nombre,
                descripcion: g.descripcion,
            },
        }));
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getGroupsController = getGroupsController;
