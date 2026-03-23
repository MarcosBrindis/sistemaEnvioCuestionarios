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
exports.updateLaborAchievementController = void 0;
const dependencies_1 = require("../../dependencies");
const UpdateLaborAchievement_1 = require("../../../application/usecase/UpdateLaborAchievement");
const updateLaborAchievementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEgresado = Number(req.params.id);
        const idAchievement = Number(req.params.idLogro);
        const { data } = req.body;
        if (!data || data.type !== 'logros-laborales')
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        const attrs = data.attributes || {};
        const usecase = new UpdateLaborAchievement_1.UpdateLaborAchievement(dependencies_1.laborAchievementRepository);
        const updated = yield usecase.execute(idEgresado, idAchievement, {
            company: attrs.empresa,
            position: attrs.puesto,
            date: attrs.fecha,
        });
        if (!updated)
            return res.status(404).json({ error: 'Logro no encontrado o no pertenece al egresado' });
        res.json({ data: { type: 'logros-laborales', id: String(updated.id_labor_achievement), attributes: { empresa: updated.company, puesto: updated.position, fecha: updated.date } } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateLaborAchievementController = updateLaborAchievementController;
