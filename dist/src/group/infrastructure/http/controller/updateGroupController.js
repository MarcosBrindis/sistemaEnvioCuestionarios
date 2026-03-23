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
exports.updateGroupController = void 0;
const dependencies_1 = require("../../dependencies");
const UpdateGroup_1 = require("../../../application/usecase/UpdateGroup");
const updateGroupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { data } = req.body;
        if (!data || data.type !== 'grupos') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const attrs = data.attributes || {};
        const usecase = new UpdateGroup_1.UpdateGroup(dependencies_1.groupRepository);
        const updated = yield usecase.execute(id, { nombre: attrs.name, descripcion: attrs.descripcion });
        if (!updated)
            return res.status(404).json({ error: 'Grupo no encontrado' });
        res.json({
            data: {
                type: 'grupos',
                id: String(updated.id_grupo),
                attributes: {
                    name: updated.nombre,
                    descripcion: updated.descripcion,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateGroupController = updateGroupController;
