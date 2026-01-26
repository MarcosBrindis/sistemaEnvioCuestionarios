import { Request, Response } from "express";
import { academicAchievementRepository } from "../../dependencies";
import { GeTAllacademicAchievement } from "../../../application/usecase/GeTAllacademicAchievement";

export const getAllacademicAchievementController = async (_req: Request, res: Response) => {
    try {
        const usecase = new GeTAllacademicAchievement(academicAchievementRepository);
        const list = await usecase.execute();
        const data = list.map((a: any) => ({
            type: 'logros-academicos',
            id: String(a.id_academic_achievement),
            attributes: {
                nombre: a.name,
                institucion: a.institution,
                fecha: a.date,
            },
        }));
        res.json({ data });
    } catch (error: any) {
        res.status(500).json({ error: error.message
        })
    }
}
