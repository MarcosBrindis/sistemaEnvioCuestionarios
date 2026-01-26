import { Request, Response, NextFunction } from 'express';
import { RevokeSurveyAccess } from '../../../application/usecase/RevokeSurveyAccess';
// import { errorHandler } from '../../../../core/middleware/errorHandler';

export const revokeSurveyAccessController = (revokeSurveyAccess: RevokeSurveyAccess) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = req.params.uuid;
    await revokeSurveyAccess.execute(uuid);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
