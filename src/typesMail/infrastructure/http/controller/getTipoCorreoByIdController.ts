import { Request, Response, NextFunction } from 'express';
import { GetTipoCorreoById } from '../../../application/usecase/GetTiposCorreo';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getTipoCorreoByIdController = (getTipoCorreoById: GetTipoCorreoById) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const tipoCorreo = await getTipoCorreoById.execute(id);
    if (!tipoCorreo) {
      res.status(404).json({
        error: {
          status: '404',
          title: 'Not Found',
          detail: 'El tipo de correo no fue encontrado'
        }
      });
      return;
    }
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
    handleGetError(error as Error, req, res, next);
  }
};
