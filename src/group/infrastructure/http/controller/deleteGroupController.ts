import { Request, Response } from 'express';
import { groupRepository } from '../../dependencies';
import { DeleteGroup } from '../../../application/usecase/DeleteGroup';

export const deleteGroupController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usecase = new DeleteGroup(groupRepository);
    await usecase.execute(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
