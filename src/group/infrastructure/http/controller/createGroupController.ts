import { Request, Response } from 'express';
import { groupRepository } from '../../dependencies';
import { CreateGroup } from '../../../application/usecase/CreateGroup';

export const createGroupController = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data || data.type !== 'grupos') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
  const attrs = data.attributes || {};
  const usecase = new CreateGroup(groupRepository);
  const created = await usecase.execute({ nombre: attrs.nombre, descripcion: attrs.descripcion });
    res.status(201).json({
      data: {
        type: 'grupos',
        id: String(created.id_grupo),
        attributes: {
          name: created.nombre,
          descripcion: created.descripcion,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
