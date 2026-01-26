import { Request, Response } from 'express';
import { UnsubscribeEgresado } from '../../../application/usecase/UnsubscribeEgresado';

export const unsubscribeEgresadoController = (unsubscribeEgresado: UnsubscribeEgresado) => async (
  req: Request,
  res: Response
) => {
  const id = req.session.user!.id;
  const motivo = req.body?.data?.attributes?.motivo || 'Sin motivo';
  const result = await unsubscribeEgresado.execute(id, motivo);
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
