import { Request, Response, NextFunction } from 'express';
import { UpdateQuestion } from '../../../application/usecase/UpdateQuestion';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';

export const updateQuestionController = (updateQuestion: UpdateQuestion) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const { texto_pregunta, es_obligatoria } = req.body.data.attributes;
    
    // Extraer id_tipo_pregunta de relationships si existe
    let id_tipo_pregunta: number | undefined;
    if (req.body.data.relationships && req.body.data.relationships['tipo-pregunta']) {
      id_tipo_pregunta = Number(req.body.data.relationships['tipo-pregunta'].data?.id);
    }

    const question = await updateQuestion.execute(id, { texto_pregunta, es_obligatoria, id_tipo_pregunta });
    
    // Respuesta con formato JSON API
    res.status(200).json({
      data: {
        type: 'preguntas',
        id: question.id_pregunta?.toString(),
        attributes: {
          texto_pregunta: question.texto_pregunta,
          es_obligatoria: question.es_obligatoria
        },
        relationships: {
          'tipo-pregunta': {
            data: { 
              type: 'tipos-pregunta', 
              id: question.id_tipo_pregunta.toString() 
            }
          }
        }
      }
    });
  } catch (error) {
    handleUpdateError(error as Error, req, res, next);
  }
};
