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
exports.getAllLaborAchievementsController = void 0;
const dependencies_1 = require("../../dependencies");
const GetAllLaborAchievements_1 = require("../../../application/usecase/GetAllLaborAchievements");
const getAllLaborAchievementsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usecase = new GetAllLaborAchievements_1.GetAllLaborAchievements(dependencies_1.laborAchievementRepository);
        const list = yield usecase.execute();
        const data = list.map((l) => ({
            type: 'logros-laborales',
            id: String(l.id_labor_achievement),
            attributes: {
                empresa: l.company,
                puesto: l.position,
                fecha: l.date,
            },
        }));
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllLaborAchievementsController = getAllLaborAchievementsController;
