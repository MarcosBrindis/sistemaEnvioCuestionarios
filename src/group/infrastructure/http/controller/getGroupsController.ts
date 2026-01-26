import { Request, Response } from 'express';
import { groupRepository } from '../../dependencies';
import { GetGroups } from '../../../application/usecase/GetGroups';

export const getGroupsController = async (_: Request, res: Response) => {
  try {
    const usecase = new GetGroups(groupRepository);
    const list = await usecase.execute();
    const data = list.map((g: any) => ({
      type: 'grupos',
      id: String(g.id_grupo),
      attributes: {
        name: g.nombre,
        descripcion: g.descripcion,
      },
    }));
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
