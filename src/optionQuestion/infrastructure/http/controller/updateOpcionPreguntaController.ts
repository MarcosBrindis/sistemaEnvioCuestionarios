import { Request, Response, NextFunction } from 'express';
import { UpdateOpcionPregunta } from '../../../application/usecase/UpdateOpcionPregunta';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';

export const updateOpcionPreguntaController = (updateOpcionPregunta: UpdateOpcionPregunta) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'ID debe ser un número válido'
        }
      });
      return;
    }

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

    const updateData: any = {};
    
    // Extraer atributos - Soportar ambos formatos: kebab-case y snake_case
    if (req.body.data.attributes['texto-opcion'] !== undefined) {
      updateData.texto_opcion = req.body.data.attributes['texto-opcion'];
    } else if (req.body.data.attributes['texto_opcion'] !== undefined) {
      updateData.texto_opcion = req.body.data.attributes['texto_opcion'];
    }
    
    if (req.body.data.attributes.etiqueta !== undefined) {
      updateData.etiqueta = req.body.data.attributes.etiqueta;
    }

    // Extraer relaciones si están presentes
    if (req.body.data.relationships?.pregunta?.data?.id) {
      updateData.id_pregunta = Number(req.body.data.relationships.pregunta.data.id);
    }

    // Actualizar la opción
    const updatedOpcionPregunta = await updateOpcionPregunta.execute(id, updateData);

    // Respuesta en formato JSON API
    res.status(200).json({
      data: {
        id: updatedOpcionPregunta.id_opcion_pregunta?.toString(),
        type: 'opcion-pregunta',
        attributes: {
          'texto-opcion': updatedOpcionPregunta.texto_opcion,
          etiqueta: updatedOpcionPregunta.etiqueta
        },
        relationships: {
          pregunta: {
            data: {
              id: updatedOpcionPregunta.id_pregunta.toString(),
              type: 'pregunta'
            }
          }
        }
      }
    });

  } catch (error: any) {
    console.log('Error en UPDATE opción:', error.message); // Debug
    
    if (error.message.includes('no existe')) {
      res.status(404).json({
        error: {
          status: '404',
          title: 'Not Found',
          detail: error.message
        }
      });
    } else if (error.message.includes('campo') || error.message.includes('obligatorio') || 
               error.message.includes('vacío') || error.message.includes('existe')) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
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
      handleUpdateError(error, req, res, next);
    }
  }
};