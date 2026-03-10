import { Request, Response, NextFunction } from 'express';
import { DeleteDatosLaborales } from '../../../application/usecase/DeleteDatosLaborales';

export const deleteDatosLaboralesController = (
  deleteDatosLaborales: DeleteDatosLaborales
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await deleteDatosLaborales.execute(sessionEgresadoId);

    if (!result) {
      return res.status(404).json({ 
        error: 'No se pudieron eliminar los datos laborales' 
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
