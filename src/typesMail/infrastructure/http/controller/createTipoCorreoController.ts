
import { Request, Response, NextFunction } from 'express';
import { CreateTipoCorreo } from '../../../application/usecase/CreateTipoCorreo';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createTipoCorreoController = (createTipoCorreo: CreateTipoCorreo) => async (req: Request, res: Response, next: NextFunction) => {
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
    const { tipo } = req.body.data.attributes;
    const tipoCorreo = await createTipoCorreo.execute(tipo);
    res.status(201).json({
      data: {
        type: 'tipos-correo',
        id: tipoCorreo.id_tipo_correo?.toString(),
        attributes: {
          tipo: tipoCorreo.tipo
        }
      }
    });
  } catch (error) {
    handlePostError(error as Error, req, res, next);
  }
};
