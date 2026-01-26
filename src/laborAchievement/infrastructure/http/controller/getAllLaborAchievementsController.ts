import { Request, Response } from 'express';
import { laborAchievementRepository } from '../../dependencies';
import { GetAllLaborAchievements } from '../../../application/usecase/GetAllLaborAchievements';

export const getAllLaborAchievementsController = async (_req: Request, res: Response) => {
  try {
    const usecase = new GetAllLaborAchievements(laborAchievementRepository);
    const list = await usecase.execute();
    const data = list.map((l: any) => ({
      type: 'logros-laborales',
      id: String(l.id_labor_achievement),
      attributes: {
        empresa: l.company,
        puesto: l.position,
        fecha: l.date,
      },
    }));
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
