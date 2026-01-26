import { Request, Response, NextFunction } from 'express';
import { DeleteSurvey } from '../../../application/usecase/DeleteSurvey';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteSurveyController = (deleteSurvey: DeleteSurvey) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await deleteSurvey.execute(id);
    if (result === 'deleted') {
      res.status(204).send();
    } else {
      res.status(200).json({ meta: { deactivated: true } });
    }
  } catch (error) {
    handleDeleteError(error as Error, req, res, next);
  }
};
