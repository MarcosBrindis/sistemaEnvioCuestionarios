import { Request, Response, NextFunction } from 'express';
import { GetQuestionsWithOptions } from '../../../application/usecase/GetQuestion';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getQuestionsWithOptionsController = (
  getQuestionsWithOptions: GetQuestionsWithOptions
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Obtener todas las preguntas con opciones
    const questionsWithOptions = await getQuestionsWithOptions.execute();
    
    // Respuesta con formato JSON API para colección
    res.status(200).json({
      data: questionsWithOptions.map(question => ({
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
              id: question.id_tipo_pregunta.toString(),
              nombre: question.tipo_pregunta_nombre
            }
          }
        },
        included: {
          opciones: question.opciones?.map((opcion: any) => ({
            type: 'opciones-pregunta',
            id: opcion.id_opcion_pregunta?.toString(),
            attributes: {
              texto_opcion: opcion.texto_opcion,
              etiqueta: opcion.etiqueta
            }
          })) || []
        }
      })),
      meta: {
        total: questionsWithOptions.length
      }
    });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
