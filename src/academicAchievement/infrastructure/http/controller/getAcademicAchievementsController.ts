
import { Request, Response } from 'express';
import { academicAchievementRepository } from '../../dependencies';
import { GetAcademicAchievements } from '../../../application/usecase/GetAcademicAchievements';

export const getAcademicAchievementsController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const usecase = new GetAcademicAchievements(academicAchievementRepository);
    const list = await usecase.execute(idEgresado);
    const data = list.map((a: any) => ({
      type: 'logros-academicos',
      id: String(a.id_academic_achievement),
      attributes: {
        titulo: a.name,
        institucion: a.institution,
        fecha: a.date,
      },
    }));
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
