
import { Request, Response } from 'express';
import { academicAchievementRepository } from '../../dependencies';
import { CreateAcademicAchievement } from '../../../application/usecase/CreateAcademicAchievement';

export const createAcademicAchievementController = async (req: Request, res: Response) => {
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
    const usecase = new CreateAcademicAchievement(academicAchievementRepository);
    const created = await usecase.execute(idEgresado, payload);
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
