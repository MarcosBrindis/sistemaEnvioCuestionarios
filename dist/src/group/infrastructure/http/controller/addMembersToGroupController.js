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
exports.addMembersToGroupController = void 0;
const dependencies_1 = require("../../dependencies");
const AddMembersToGroup_1 = require("../../../application/usecase/AddMembersToGroup");
const dependencies_2 = require("../../../../egresado/infrastructure/dependencies");
// Verifica que el path sea correcto. Si no, usa '../../../egresado/infrastructure/dependencies'
const addMembersToGroupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { data } = req.body;
        if (!data || data.type !== 'miembros-grupo') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const attrs = data.attributes || {};
        if (!Array.isArray(attrs.ids_graduados) || attrs.ids_graduados.length === 0) {
            return res.status(400).json({ error: 'Debes enviar al menos un id de egresado' });
        }
        const usecase = new AddMembersToGroup_1.AddMembersToGroup(dependencies_1.groupMemberRepository, dependencies_2.egresadoRepository);
        yield usecase.execute(id, attrs.ids_graduados);
        res.status(201).json({ meta: { message: 'Miembros agregados correctamente' } });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addMembersToGroupController = addMembersToGroupController;
