import { Request, Response, NextFunction } from 'express';
import { RemoveQuestionFromFormulario } from '../../../application/usecase/RemoveQuestionFromForm';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const removePreguntaController = (removeQuestion: RemoveQuestionFromFormulario) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const formularioId = Number(req.params.id);
    const preguntaId = Number(req.params.preguntaId);

    if (isNaN(formularioId) || isNaN(preguntaId)) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'IDs deben ser numéricos' }});
      return;
    }

    await removeQuestion.execute(formularioId, preguntaId);
    res.status(204).send();
  } catch (error) {
    handleDeleteError(error as Error, req, res, next);
  }
};
