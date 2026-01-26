import { Request, Response, NextFunction } from 'express';
import { DeleteEmailTemplate } from '../../../application/usecase/DeleteEmailTemplate';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteEmailTemplateController = (deleteEmailTemplate: DeleteEmailTemplate) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await deleteEmailTemplate.execute(id);
    res.status(204).send();
  } catch (error) {
    handleDeleteError(error as Error, req, res, next);
  }
};
