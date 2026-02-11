import { Request, Response, NextFunction } from 'express';
import { DeleteDatosDomiciliarios } from '../../../application/usecase/DeleteDatosDomiciliarios';

export const deleteDatosDomiciliariosController = (
  deleteDatosDomiciliarios: DeleteDatosDomiciliarios
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await deleteDatosDomiciliarios.execute(sessionEgresadoId);

    if (!result) {
      return res.status(404).json({ 
        error: 'No se pudieron eliminar los datos domiciliarios' 
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
