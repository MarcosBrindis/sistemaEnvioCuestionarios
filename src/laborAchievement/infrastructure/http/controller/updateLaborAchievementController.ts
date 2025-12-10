import { Request, Response } from 'express';
import { laborAchievementRepository } from '../../dependencies';
import { UpdateLaborAchievement } from '../../../application/usecase/UpdateLaborAchievement';

export const updateLaborAchievementController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const idAchievement = Number(req.params.idLogro);
    const { data } = req.body;
    if (!data || data.type !== 'logros-laborales') return res.status(400).json({ error: 'Tipo de recurso inválido' });
    const attrs = data.attributes || {};
    const usecase = new UpdateLaborAchievement(laborAchievementRepository);
    const updated = await usecase.execute(idEgresado, idAchievement, {
      company: attrs.empresa,
      position: attrs.puesto,
      date: attrs.fecha,
    });
    if (!updated) return res.status(404).json({ error: 'Logro no encontrado o no pertenece al egresado' });
    res.json({ data: { type: 'logros-laborales', id: String(updated.id_labor_achievement), attributes: { empresa: updated.company, puesto: updated.position, fecha: updated.date } } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
