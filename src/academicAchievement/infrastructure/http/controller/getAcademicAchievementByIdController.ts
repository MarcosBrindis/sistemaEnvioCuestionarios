
import { Request, Response } from 'express';
import { academicAchievementRepository } from '../../dependencies';
import { GetAcademicAchievementById } from '../../../application/usecase/GetAcademicAchievementById';

export const getAcademicAchievementByIdController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const idAchievement = Number(req.params.idLogro);
    const usecase = new GetAcademicAchievementById(academicAchievementRepository);
    const logro = await usecase.execute(idEgresado, idAchievement);
    if (!logro) return res.status(404).json({ error: 'Logro no encontrado' });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
