
import { Request, Response, NextFunction } from 'express';
import { GetTiposCorreo } from '../../../application/usecase/GetTiposCorreo';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getTiposCorreoController = (getTiposCorreo: GetTiposCorreo) => async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tiposCorreo = await getTiposCorreo.execute();
    res.status(200).json({
      data: tiposCorreo.map((tipoCorreo: any) => ({
        type: 'tipos-correo',
        id: tipoCorreo.id_tipo_correo?.toString(),
        attributes: {
          tipo: tipoCorreo.tipo
        }
      }))
    });
  } catch (error) {
    handleGetError(error as Error, _req, res, next);
  }
};
