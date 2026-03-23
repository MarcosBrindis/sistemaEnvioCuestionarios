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
exports.createGroupController = void 0;
const dependencies_1 = require("../../dependencies");
const CreateGroup_1 = require("../../../application/usecase/CreateGroup");
const createGroupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        if (!data || data.type !== 'grupos') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const attrs = data.attributes || {};
        const usecase = new CreateGroup_1.CreateGroup(dependencies_1.groupRepository);
        const created = yield usecase.execute({ nombre: attrs.nombre, descripcion: attrs.descripcion });
        res.status(201).json({
            data: {
                type: 'grupos',
                id: String(created.id_grupo),
                attributes: {
                    name: created.nombre,
                    descripcion: created.descripcion,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createGroupController = createGroupController;
