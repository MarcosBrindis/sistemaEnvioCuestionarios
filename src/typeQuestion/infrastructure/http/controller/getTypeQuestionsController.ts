import { Request, Response, NextFunction } from 'express';
import { GetTypeQuestionById, GetAllTypeQuestions } from '../../../application/usecase/GetTypeQuestion';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getTypeQuestionsController = (
  getTypeQuestionById: GetTypeQuestionById,
  getAllTypeQuestions: GetAllTypeQuestions
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Si hay ID, buscar uno específico
    if (id) {
      const typeQuestion = await getTypeQuestionById.execute(Number(id));
      
      if (!typeQuestion) {
        res.status(404).json({
          error: {
            status: '404',
            title: 'Not Found',
            detail: 'El tipo de pregunta no fue encontrado'
          }
        });
        return;
      }
      
      // Respuesta con formato JSON API para un recurso
      res.status(200).json({
        data: {
          type: 'tipos-pregunta',
          id: typeQuestion.id_tipo_pregunta?.toString(),
          attributes: {
            nombre: typeQuestion.nombre
          }
        }
      });
      return;
    }
    
    // Si no hay ID, obtener todos
    const typeQuestions = await getAllTypeQuestions.execute();
    
    // Respuesta con formato JSON API para colección
    res.status(200).json({
      data: typeQuestions.map(typeQuestion => ({
        type: 'tipos-pregunta',
        id: typeQuestion.id_tipo_pregunta?.toString(),
        attributes: {
          nombre: typeQuestion.nombre
        }
      }))
    });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
