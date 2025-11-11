import { Request, Response, NextFunction } from 'express';
import { DeleteTypeQuestion } from '../../../application/usecase/DeleteTypeQuestion';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteTypeQuestionController = (deleteTypeQuestion: DeleteTypeQuestion) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await deleteTypeQuestion.execute(id);
    
    // Para DELETE exitoso, JSON API permite respuesta 204 sin cuerpo o 200 con meta información
    res.status(204).send(); 
  } catch (error) {
    handleDeleteError(error as Error, req, res, next);
  }
};