import { Request, Response } from 'express';
import { groupRepository } from '../../dependencies';
import { GetGroupById } from '../../../application/usecase/GetGroupById';
import { ListGroupMembers } from '../../../application/usecase/ListGroupMembers';
import { groupMemberRepository } from '../../dependencies';

export const getGroupByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usecase = new GetGroupById(groupRepository);
    const group = await usecase.execute(id);
    if (!group) return res.status(404).json({ error: 'Grupo no encontrado' });
    const membersUsecase = new ListGroupMembers(groupMemberRepository);
    const miembros = await membersUsecase.execute(id);
    res.json({
      data: {
        type: 'grupos',
        id: String(group.id_grupo),
        attributes: {
          name: group.nombre,
          descripcion: group.descripcion,
        },
        relationships: {
          miembros: miembros.map(m => ({ type: 'egresados', id: String(m.id_egresado) }))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
