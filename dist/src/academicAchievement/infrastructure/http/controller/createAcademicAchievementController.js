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
exports.createAcademicAchievementController = void 0;
const dependencies_1 = require("../../dependencies");
const CreateAcademicAchievement_1 = require("../../../application/usecase/CreateAcademicAchievement");
const createAcademicAchievementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEgresado = Number(req.params.id);
        const { data } = req.body;
        if (!data || data.type !== 'logros-academicos') {
            return res.status(400).json({ error: 'Tipo de recurso inválido' });
        }
        const attrs = data.attributes || {};
        const payload = {
            name: attrs.titulo,
            institution: attrs.institucion,
            date: attrs.fecha || null,
        };
        const usecase = new CreateAcademicAchievement_1.CreateAcademicAchievement(dependencies_1.academicAchievementRepository);
        const created = yield usecase.execute(idEgresado, payload);
        res.status(201).json({
            data: {
                type: 'logros-academicos',
                id: String(created.id_academic_achievement),
                attributes: {
                    titulo: created.name,
                    institucion: created.institution,
                    fecha: created.date,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createAcademicAchievementController = createAcademicAchievementController;
