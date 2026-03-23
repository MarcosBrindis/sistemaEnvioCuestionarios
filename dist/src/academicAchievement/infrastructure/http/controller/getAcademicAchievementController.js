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
exports.getAllacademicAchievementController = void 0;
const dependencies_1 = require("../../dependencies");
const GeTAllacademicAchievement_1 = require("../../../application/usecase/GeTAllacademicAchievement");
const getAllacademicAchievementController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usecase = new GeTAllacademicAchievement_1.GeTAllacademicAchievement(dependencies_1.academicAchievementRepository);
        const list = yield usecase.execute();
        const data = list.map((a) => ({
            type: 'logros-academicos',
            id: String(a.id_academic_achievement),
            attributes: {
                nombre: a.name,
                institucion: a.institution,
                fecha: a.date,
            },
        }));
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message
        });
    }
});
exports.getAllacademicAchievementController = getAllacademicAchievementController;
