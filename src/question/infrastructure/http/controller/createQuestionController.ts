import { Request, Response, NextFunction } from 'express';
import { CreateQuestion } from '../../../application/usecase/CreateQuestion';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createQuestionController = (createQuestion: CreateQuestion) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validar estructura JSON API
    if (!req.body.data || !req.body.data.attributes || !req.body.data.relationships) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'El formato debe seguir la especificación JSON API con relationships'
        }
      });
      return;
    }

    const { texto_pregunta, es_obligatoria } = req.body.data.attributes;
    const id_tipo_pregunta = Number(req.body.data.relationships['tipo-pregunta']?.data?.id);

    if (!id_tipo_pregunta) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'El campo tipo-pregunta es obligatorio en relationships'
        }
      });
      return;
    }

    const question = await createQuestion.execute({ texto_pregunta, es_obligatoria, id_tipo_pregunta });
    
    // Respuesta con formato JSON API
    res.status(201).json({
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
    handlePostError(error as Error, req, res, next);
  }
};
