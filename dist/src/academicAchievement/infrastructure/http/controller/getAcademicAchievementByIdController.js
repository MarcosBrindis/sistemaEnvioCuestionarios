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
exports.getAcademicAchievementByIdController = void 0;
const dependencies_1 = require("../../dependencies");
const GetAcademicAchievementById_1 = require("../../../application/usecase/GetAcademicAchievementById");
const getAcademicAchievementByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEgresado = Number(req.params.id);
        const idAchievement = Number(req.params.idLogro);
        const usecase = new GetAcademicAchievementById_1.GetAcademicAchievementById(dependencies_1.academicAchievementRepository);
        const logro = yield usecase.execute(idEgresado, idAchievement);
        if (!logro)
            return res.status(404).json({ error: 'Logro no encontrado' });
        res.json({
            data: {
                type: 'logros-academicos',
                id: String(logro.id_academic_achievement),
                attributes: {
                    titulo: logro.name,
                    institucion: logro.institution,
                    fecha: logro.date,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAcademicAchievementByIdController = getAcademicAchievementByIdController;
