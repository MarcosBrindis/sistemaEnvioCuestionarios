import { Request, Response, NextFunction } from 'express';
import { UpdateEstadoEgresado } from '../../../application/usecase/UpdateEstadoEgresado';

export const updateEstadoEgresadoController = (updateEstadoEgresado: UpdateEstadoEgresado) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const egresadoId = Number(req.params.id);
    const { id_estado } = req.body.data?.attributes || {};

    if (!id_estado) {
      return res.status(400).json({ error: 'El estado (id_estado) es requerido' });
    }

    const result = await updateEstadoEgresado.execute({
      id: egresadoId,
      id_estado: Number(id_estado),
    });

    return res.json({
      data: {
        type: 'egresados',
        id: result.id_egresado,
        attributes: result
      }
    });
  } catch (error) {
    next(error);
  }
};
