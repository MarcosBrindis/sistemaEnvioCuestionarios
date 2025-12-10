import { Request, Response } from 'express';
import { groupMemberRepository } from '../../dependencies';
import { RemoveMemberFromGroup } from '../../../application/usecase/RemoveMemberFromGroup';

export const removeMemberFromGroupController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const idEgresado = Number(req.params.idEgresado);
    const usecase = new RemoveMemberFromGroup(groupMemberRepository);
    await usecase.execute(id, idEgresado);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
