
import { Request, Response, NextFunction } from 'express';
import { UpdateTipoCorreo } from '../../../application/usecase/UpdateTipoCorreo';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';

export const updateTipoCorreoController = (updateTipoCorreo: UpdateTipoCorreo) => async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    const { tipo } = req.body.data.attributes;
    const tipoCorreo = await updateTipoCorreo.execute(id, tipo);
    res.status(200).json({
      data: {
        type: 'tipos-correo',
        id: tipoCorreo.id_tipo_correo?.toString(),
        attributes: {
          tipo: tipoCorreo.tipo
        }
      }
    });
  } catch (error) {
    handleUpdateError(error as Error, req, res, next);
  }
};
