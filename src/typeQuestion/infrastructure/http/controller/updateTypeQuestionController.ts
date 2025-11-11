import { Request, Response, NextFunction } from 'express';
import { UpdateTypeQuestion } from '../../../application/usecase/UpdateTypeQuestion';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';

export const updateTypeQuestionController = (updateTypeQuestion: UpdateTypeQuestion) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validar estructura JSON API
    if (!req.body.data || !req.body.data.attributes) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'El formato debe seguir la especificación JSON API'
        }
      });
      return;
    }

    const id = Number(req.params.id);
    const { nombre } = req.body.data.attributes;
    const typeQuestion = await updateTypeQuestion.execute(id, { nombre });
    
    // Respuesta con formato JSON API
    res.status(200).json({
      data: {
        type: 'tipos-pregunta',
        id: typeQuestion.id_tipo_pregunta?.toString(),
        attributes: {
          nombre: typeQuestion.nombre
        }
      }
    });
  } catch (error) {
    handleUpdateError(error as Error, req, res, next);
  }
};