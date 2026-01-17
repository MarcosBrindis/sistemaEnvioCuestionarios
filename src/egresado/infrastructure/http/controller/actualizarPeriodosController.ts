import { Request, Response, NextFunction } from 'express';
import { ActualizarPeriodosEgresados } from '../../../application/usecase/ActualizarPeriodosEgresados';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const actualizarPeriodosController = (actualizarPeriodos: ActualizarPeriodosEgresados) => async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const params = {
      programa: req.query.programa as string,
      matricula_like: req.query.matricula_like as string,
      periodo: req.query.periodo as string,
      periodo_from: req.query.periodo_from as string,
      periodo_to: req.query.periodo_to as string
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const result = await actualizarPeriodos.execute(
      Object.keys(filteredParams).length > 0 ? filteredParams : undefined
    );

    res.status(200).json({
      data: {
        type: 'actualizacion-periodos',
        attributes: {
          status: result.status,
          resumen: result.resumen
        }
      },
      meta: {
        errores: result.errores?.slice(0, 10) // Limitar errores mostrados
      }
    });

  } catch (error) {
    const err = error as Error;
    console.error('Error en controlador de actualización de periodos:', err);
    
    if (err.message.includes('Error al obtener') || err.message.includes('Error en')) {
      res.status(502).json({
        error: {
          status: '502',
          title: 'Bad Gateway',
          detail: `Error conectando con el servicio externo: ${err.message}`
        }
      });
    } else {
      handlePostError(err, req, res, next);
    }
  }
};
