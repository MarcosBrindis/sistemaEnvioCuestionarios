import { Request, Response, NextFunction } from 'express';
import { GetOpcionPreguntaById, GetAllOpcionesPreguntas, GetOpcionPreguntasByQuestionId } from '../../../application/usecase/GetOpcionPregunta';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getOpcionPreguntasController = (
  getOpcionPreguntaById: GetOpcionPreguntaById, 
  getAllOpcionesPreguntas: GetAllOpcionesPreguntas,
  getOpcionPreguntasByQuestionId: GetOpcionPreguntasByQuestionId
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { preguntaId } = req.query; 

    // Obtener por ID específico
    if (id) {
      const numId = Number(id);
      if (isNaN(numId)) {
        res.status(400).json({
          error: {
            status: '400',
            title: 'Bad Request',
            detail: 'ID debe ser un número válido'
          }
        });
        return;
      }

      const opcionPregunta = await getOpcionPreguntaById.execute(numId);
      
      if (!opcionPregunta) {
        res.status(404).json({
          error: {
            status: '404',
            title: 'Not Found',
            detail: 'Opción de pregunta no encontrada'
          }
        });
        return;
      }

      res.status(200).json({
        data: {
          id: opcionPregunta.id_opcion_pregunta?.toString(),
          type: 'opcion-pregunta',
          attributes: {
            'texto-opcion': opcionPregunta.texto_opcion,
            etiqueta: opcionPregunta.etiqueta
          },
          relationships: {
            pregunta: {
              data: {
                id: opcionPregunta.id_pregunta.toString(),
                type: 'pregunta'
              }
            }
          }
        }
      });
      return;
    }

    // Filtrar por preguntaId si se proporciona
    if (preguntaId) {
      const numPreguntaId = Number(preguntaId);
      if (isNaN(numPreguntaId)) {
        res.status(400).json({
          error: {
            status: '400',
            title: 'Bad Request',
            detail: 'preguntaId debe ser un número válido'
          }
        });
        return;
      }

      const opcionesPreguntas = await getOpcionPreguntasByQuestionId.execute(numPreguntaId);
      
      res.status(200).json({
        data: opcionesPreguntas.map(opcionPregunta => ({
          id: opcionPregunta.id_opcion_pregunta?.toString(),
          type: 'opcion-pregunta',
          attributes: {
            'texto-opcion': opcionPregunta.texto_opcion,
            etiqueta: opcionPregunta.etiqueta
          },
          relationships: {
            pregunta: {
              data: {
                id: opcionPregunta.id_pregunta.toString(),
                type: 'pregunta'
              }
            }
          }
        }))
      });
      return;
    }

    // Obtener todas las opciones de preguntas
    const opcionesPreguntas = await getAllOpcionesPreguntas.execute();
    
    res.status(200).json({
      data: opcionesPreguntas.map(opcionPregunta => ({
        id: opcionPregunta.id_opcion_pregunta?.toString(),
        type: 'opcion-pregunta',
        attributes: {
          'texto-opcion': opcionPregunta.texto_opcion,
          etiqueta: opcionPregunta.etiqueta
        },
        relationships: {
          pregunta: {
            data: {
              id: opcionPregunta.id_pregunta.toString(),
              type: 'pregunta'
            }
          }
        }
      }))
    });

  } catch (error: any) {
    console.log('Error en GET opciones:', error.message); // Debug
    
    // Usar el error handler del middleware
    handleGetError(error, req, res, next);
  }
};