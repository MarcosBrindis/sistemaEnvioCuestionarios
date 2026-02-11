import { Request, Response, NextFunction } from 'express';
import { GetDatosLaboralesByEgresado } from '../../../application/usecase/GetDatosLaboralesByEgresado';

export const getDatosLaboralesController = (
  getDatosLaborales: GetDatosLaboralesByEgresado
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await getDatosLaborales.execute(sessionEgresadoId);

    if (!result) {
      return res.status(404).json({ 
        error: 'No se encontraron datos laborales para este egresado' 
      });
    }

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
