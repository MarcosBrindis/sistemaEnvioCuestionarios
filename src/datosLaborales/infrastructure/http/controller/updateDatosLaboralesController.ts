import { Request, Response, NextFunction } from 'express';
import { UpdateDatosLaborales } from '../../../application/usecase/UpdateDatosLaborales';

export const updateDatosLaboralesController = (
  updateDatosLaborales: UpdateDatosLaborales
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { trabaja_actualmente, nombre_empresa, puesto, id_sector, actividad_principal } = 
      req.body.data?.attributes || {};

    const result = await updateDatosLaborales.execute(sessionEgresadoId, {
      trabaja_actualmente,
      nombre_empresa,
      puesto,
      id_sector,
      actividad_principal
    });

    return res.json({ 
      data: { 
        type: 'datos-laborales', 
        id: result.id_datos_laborales, 
        attributes: result 
      } 
    });
  } catch (error) {
    next(error);
  }
};
