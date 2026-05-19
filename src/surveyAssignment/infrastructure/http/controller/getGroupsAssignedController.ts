import { Request, Response, NextFunction } from 'express';
import { GetGroupsAssignedToSurvey } from '../../../application/usecase/GetGroupsAssignedToSurvey';

export const getGroupsAssignedController = (getGroupsAssigned: GetGroupsAssignedToSurvey) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idEncuesta = Number(req.params.id);
    const result = await getGroupsAssigned.execute(idEncuesta);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
