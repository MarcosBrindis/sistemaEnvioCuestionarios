import { Request, Response } from 'express';
import { ResubscribeEgresado } from '../../../application/usecase/ResubscribeEgresado';

export const resubscribeEgresadoController = (resubscribeEgresado: ResubscribeEgresado) => async (
  req: Request,
  res: Response
) => {
  const id = req.session.user!.id;
  const result = await resubscribeEgresado.execute(id);
  res.status(200).json({
    data: {
      type: 'egresados',
      id: String(id),
      attributes: {
        mensaje: 'Estado de suscripción actualizado correctamente.',
        is_active: result.is_active,
        estado_actual: result.estado_actual
      }
    }
  });
};
