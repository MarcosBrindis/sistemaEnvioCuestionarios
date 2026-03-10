import { Request, Response, NextFunction } from 'express';
import { CreateDatosDomiciliarios } from '../../../application/usecase/CreateDatosDomiciliarios';

export const createDatosDomiciliariosController = (
  createDatosDomiciliarios: CreateDatosDomiciliarios
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionEgresadoId = req.session.user?.id;
    
    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { calle, colonia, numero_exterior, codigo_postal, estado, ciudad } = 
      req.body.data?.attributes || {};

    if (!calle || !colonia || !numero_exterior || !codigo_postal || !estado || !ciudad) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: calle, colonia, numero_exterior, codigo_postal, estado, ciudad' 
      });
    }

    const result = await createDatosDomiciliarios.execute({
      calle,
      colonia,
      numero_exterior,
      codigo_postal,
      estado,
      ciudad,
      id_egresado: sessionEgresadoId
    });

    return res.status(201).json({ 
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
