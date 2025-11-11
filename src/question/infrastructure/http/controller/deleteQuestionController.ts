import { Request, Response, NextFunction } from 'express';
import { DeleteQuestion } from '../../../application/usecase/DeleteQuestion';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteQuestionController = (deleteQuestion: DeleteQuestion) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await deleteQuestion.execute(id);
    
    // Para DELETE exitoso, JSON API permite respuesta 204 sin cuerpo
    res.status(204).send();
  } catch (error) {
    handleDeleteError(error as Error, req, res, next);
  }
};
