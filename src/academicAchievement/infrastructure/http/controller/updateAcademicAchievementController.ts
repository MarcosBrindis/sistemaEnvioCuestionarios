
import { Request, Response } from 'express';
import { academicAchievementRepository } from '../../dependencies';
import { UpdateAcademicAchievement } from '../../../application/usecase/UpdateAcademicAchievement';

export const updateAcademicAchievementController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const idAchievement = Number(req.params.idLogro);
    const { data } = req.body;
    if (!data || data.type !== 'logros-academicos') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
    const attrs = data.attributes || {};
    const usecase = new UpdateAcademicAchievement(academicAchievementRepository);
    const updated = await usecase.execute(idEgresado, idAchievement, {
      name: attrs.titulo,
      institution: attrs.institucion,
      date: attrs.fecha,
    });
    if (!updated) return res.status(404).json({ error: 'Logro no encontrado o no pertenece al egresado' });
    res.json({
      data: {
        type: 'logros-academicos',
        id: String(updated.id_academic_achievement),
        attributes: {
          titulo: updated.name,
          institucion: updated.institution,
          fecha: updated.date,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
