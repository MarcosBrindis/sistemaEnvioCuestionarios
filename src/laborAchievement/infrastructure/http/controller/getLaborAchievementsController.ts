
import { Request, Response } from 'express';
import { laborAchievementRepository } from '../../dependencies';
import { GetLaborAchievements } from '../../../application/usecase/GetLaborAchievements';

export const getLaborAchievementsController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const usecase = new GetLaborAchievements(laborAchievementRepository);
    const list = await usecase.execute(idEgresado);
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
