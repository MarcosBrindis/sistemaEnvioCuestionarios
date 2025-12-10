import { Request, Response, NextFunction } from 'express';
import { SyncEgresadosFromPlatinum } from '../../../application/usecase/SyncEgresadosFromPlatinum';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const syncEgresadosController = (syncEgresados: SyncEgresadosFromPlatinum) => async (
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

    const result = await syncEgresados.execute(
      Object.keys(filteredParams).length > 0 ? filteredParams : undefined
    );

    res.status(200).json({
      data: {
        type: 'integracion',
        attributes: {
          status: result.status,
          resumen: {
            periodos_nuevos: result.resumen.periodos_nuevos,
            egresados_procesados_total: result.resumen.egresados_procesados_total,
            nuevos_insertados: result.resumen.nuevos_insertados,
            existentes_ignorados: result.resumen.existentes_ignorados
          }
        }
      },
      meta: {
        programas_nuevos: result.resumen.programas_nuevos,
        errores: result.resumen.errores
      }
    });

  } catch (error) {
    const err = error as Error;
    console.error('Error en controlador de sincronización:', err);
    
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