
import { Request, Response } from 'express';
import { laborAchievementRepository } from '../../dependencies';
import { DeleteLaborAchievement } from '../../../application/usecase/DeleteLaborAchievement';

export const deleteLaborAchievementController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const idAchievement = Number(req.params.idLogro);
    const usecase = new DeleteLaborAchievement(laborAchievementRepository);
    await usecase.execute(idEgresado, idAchievement);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
