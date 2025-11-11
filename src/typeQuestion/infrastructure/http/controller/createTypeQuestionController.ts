import { Request, Response, NextFunction } from 'express';
import { CreateTypeQuestion } from '../../../application/usecase/CreateTypeQuestion';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createTypeQuestionController = (createTypeQuestion: CreateTypeQuestion) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
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

    const { nombre } = req.body.data.attributes;
    const typeQuestion = await createTypeQuestion.execute({ nombre });
    
    // Respuesta con formato JSON API
    res.status(201).json({
      data: {
        type: 'tipos-pregunta',
        id: typeQuestion.id_tipo_pregunta?.toString(),
        attributes: {
          nombre: typeQuestion.nombre
        }
      }
    });
  } catch (error) {
    handlePostError(error as Error, req, res, next);
  }
};