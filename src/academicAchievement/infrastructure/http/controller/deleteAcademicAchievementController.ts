
import { Request, Response } from 'express';
import { academicAchievementRepository } from '../../dependencies';
import { DeleteAcademicAchievement } from '../../../application/usecase/DeleteAcademicAchievement';

export const deleteAcademicAchievementController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const idAchievement = Number(req.params.idLogro);
    const usecase = new DeleteAcademicAchievement(academicAchievementRepository);
    await usecase.execute(idEgresado, idAchievement);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
