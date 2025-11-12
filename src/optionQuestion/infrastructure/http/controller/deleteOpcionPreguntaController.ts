import { Request, Response, NextFunction } from 'express';
import { DeleteOpcionPregunta } from '../../../application/usecase/DeleteOpcionPregunta';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteOpcionPreguntaController = (deleteOpcionPregunta: DeleteOpcionPregunta) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    await deleteOpcionPregunta.execute(id);

    // Respuesta vacía con código 204 (No Content) según JSON API
    res.status(204).send();

  } catch (error: any) {
    console.log('Error en DELETE opción:', error.message); // Debug
    
    if (error.message.includes('no existe')) {
      res.status(404).json({
        error: {
          status: '404',
          title: 'Not Found',
          detail: error.message
        }
      });
    } else if (error.message.includes('deben tener') || error.message.includes('al menos') || 
               error.message.includes('exactamente') || error.message.includes('No se puede eliminar')) {
      res.status(409).json({
        error: {
          status: '409',
          title: 'Conflict',
          detail: error.message
        }
      });
    } else {
      // Usar el error handler del middleware
      handleDeleteError(error, req, res, next);
    }
  }
};