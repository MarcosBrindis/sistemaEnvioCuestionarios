
import { Request, Response } from 'express';
import { laborAchievementRepository } from '../../dependencies';
import { GetLaborAchievementById } from '../../../application/usecase/GetLaborAchievementById';

export const getLaborAchievementByIdController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const idAchievement = Number(req.params.idLogro);
    const usecase = new GetLaborAchievementById(laborAchievementRepository);
    const logro = await usecase.execute(idEgresado, idAchievement);
    if (!logro) return res.status(404).json({ error: 'Logro no encontrado' });
    res.json({
      data: {
        type: 'logros-laborales',
        id: String(logro.id_labor_achievement),
        attributes: {
          empresa: logro.company,
          puesto: logro.position,
          fecha: logro.date,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
