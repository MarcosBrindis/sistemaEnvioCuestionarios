import { Request, Response, NextFunction } from 'express';
import { CreateDatosLaborales } from '../../../application/usecase/CreateDatosLaborales';

export const createDatosLaboralesController = (
  createDatosLaborales: CreateDatosLaborales
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { trabaja_actualmente, nombre_empresa, puesto, id_sector, actividad_principal } = 
      req.body.data?.attributes || {};

    if (trabaja_actualmente === undefined) {
      return res.status(400).json({ 
        error: 'El campo "trabaja_actualmente" es obligatorio' 
      });
    }

    const result = await createDatosLaborales.execute({
      trabaja_actualmente,
      nombre_empresa: nombre_empresa || null,
      puesto: puesto || null,
      id_sector: id_sector || null,
      actividad_principal: actividad_principal || null,
      id_egresado: sessionEgresadoId
    });

    return res.status(201).json({ 
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
