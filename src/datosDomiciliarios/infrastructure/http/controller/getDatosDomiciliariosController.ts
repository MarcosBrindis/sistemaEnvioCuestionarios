import { Request, Response, NextFunction } from 'express';
import { GetDatosDomiciliariosByEgresado } from '../../../application/usecase/GetDatosDomiciliariosByEgresado';

export const getDatosDomiciliariosController = (
  getDatosDomiciliarios: GetDatosDomiciliariosByEgresado
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await getDatosDomiciliarios.execute(sessionEgresadoId);

    if (!result) {
      return res.status(404).json({ 
        error: 'No se encontraron datos domiciliarios para este egresado' 
      });
    }

    return res.json({ 
      data: { 
        type: 'datos-domiciliarios', 
        id: result.id_datos_domiciliarios, 
        attributes: result 
      } 
    });
  } catch (error) {
    next(error);
  }
};
