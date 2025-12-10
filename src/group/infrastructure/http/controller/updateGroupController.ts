import { Request, Response } from 'express';
import { groupRepository } from '../../dependencies';
import { UpdateGroup } from '../../../application/usecase/UpdateGroup';

export const updateGroupController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { data } = req.body;
    if (!data || data.type !== 'grupos') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
    const attrs = data.attributes || {};
    const usecase = new UpdateGroup(groupRepository);
    const updated = await usecase.execute(id, { nombre: attrs.name, descripcion: attrs.descripcion });
    if (!updated) return res.status(404).json({ error: 'Grupo no encontrado' });
    res.json({
      data: {
        type: 'grupos',
        id: String(updated.id_grupo),
        attributes: {
          name: updated.nombre,
          descripcion: updated.descripcion,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
