
import { Request, Response, NextFunction } from 'express';
import { DeleteTipoCorreo } from '../../../application/usecase/DeleteTipoCorreo';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteTipoCorreoController = (deleteTipoCorreo: DeleteTipoCorreo) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteTipoCorreo.execute(id);
    res.status(204).send();
  } catch (error) {
    handleDeleteError(error as Error, req, res, next);
  }
};
