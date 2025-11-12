import { Request, Response, NextFunction } from 'express';
import { CreateOpcionPregunta } from '../../../application/usecase/CreateOpcionPregunta';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createOpcionPreguntaController = (createOpcionPregunta: CreateOpcionPregunta) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    // Extraer atributos - Soportar ambos formatos: kebab-case y snake_case
    const texto_opcion = req.body.data.attributes['texto-opcion'] || req.body.data.attributes['texto_opcion'];
    const etiqueta = req.body.data.attributes.etiqueta;
    const id_pregunta = Number(req.body.data.relationships['pregunta']?.data?.id);

    if (!id_pregunta) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'El campo pregunta es obligatorio en relationships'
        }
      });
      return;
    }

    // Crear la opción
    const opcionPregunta = await createOpcionPregunta.execute({
      texto_opcion,
      etiqueta,
      id_pregunta
    });

    // Respuesta en formato JSON API
    res.status(201).json({
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

  } catch (error: any) {
    console.log('Error en CREATE opción:', error.message); // Debug
    
    if (error.message.includes('campo') || error.message.includes('obligatorio') || 
        error.message.includes('vacío') || error.message.includes('existe')) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: error.message
        }
      });
    } else if (error.message.includes('no existe') || error.message.includes('no se pudo')) {
      res.status(404).json({
        error: {
          status: '404',
          title: 'Not Found',
          detail: error.message
        }
      });
    } else if (error.message.includes('no pueden tener opciones') || error.message.includes('máximo') || 
               error.message.includes('mismo texto') || error.message.includes('misma etiqueta')) {
      res.status(409).json({
        error: {
          status: '409',
          title: 'Conflict',
          detail: error.message
        }
      });
    } else {
      // Usar el error handler del middleware
      handlePostError(error, req, res, next);
    }
  }
};