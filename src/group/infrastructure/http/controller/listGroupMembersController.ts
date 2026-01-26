import { Request, Response } from 'express';
import { groupMemberRepository } from '../../dependencies';
import { ListGroupMembers } from '../../../application/usecase/ListGroupMembers';

export const listGroupMembersController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usecase = new ListGroupMembers(groupMemberRepository);
    const miembros = await usecase.execute(id);
    res.status(200).json({
      data: miembros.map(m => ({
        type: 'miembros-grupo',
        id: `${m.id_grupo}-${m.id_egresado}`,
        attributes: {
          id_grupo: m.id_grupo,
          id_egresado: m.id_egresado
        }
      }))
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
