import { Request, Response, NextFunction } from 'express';
import { UpdateDatosDomiciliarios } from '../../../application/usecase/UpdateDatosDomiciliarios';

export const updateDatosDomiciliariosController = (
  updateDatosDomiciliarios: UpdateDatosDomiciliarios
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { calle, colonia, numero_exterior, codigo_postal, estado, ciudad } = 
      req.body.data?.attributes || {};

    const result = await updateDatosDomiciliarios.execute(sessionEgresadoId, {
      calle,
      colonia,
      numero_exterior,
      codigo_postal,
      estado,
      ciudad
    });

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
