
import { Request, Response } from 'express';
import { laborAchievementRepository } from '../../dependencies';
import { CreateLaborAchievement } from '../../../application/usecase/CreateLaborAchievement';

export const createLaborAchievementController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const { data } = req.body;
    if (!data || data.type !== 'logros-laborales') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
    const attrs = data.attributes || {};
    const payload = {
      company: attrs.empresa,
      position: attrs.puesto,
      date: attrs.fecha || null,
    };
    const usecase = new CreateLaborAchievement(laborAchievementRepository);
    const created = await usecase.execute(idEgresado, payload);
    res.status(201).json({
      data: {
        type: 'logros-laborales',
        id: String(created.id_labor_achievement),
        attributes: {
          empresa: created.company,
          puesto: created.position,
          fecha: created.date,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
