import { Request, Response, NextFunction } from 'express';
import { UpdatePerfilCompletoAdmin } from '../../../application/usecase/UpdatePerfilCompletoAdmin';

export const updatePerfilCompletoAdminController = (updatePerfilCompletoAdmin: UpdatePerfilCompletoAdmin) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const egresadoId = Number(req.params.id);

    const { 
      nombre,
      primer_apellido,
      segundo_apellido,
      email, 
      fecha_nacimiento, 
      imagen_egresado, 
      id_programa_educativo,
      id_periodo,
      id_estado 
    } = req.body.data?.attributes || {};

    const result = await updatePerfilCompletoAdmin.execute({
      id: egresadoId,
      nombre,
      primer_apellido,
      segundo_apellido,
      email,
      fecha_nacimiento,
      imagen_egresado,
      id_programa_educativo,
      id_periodo,
      id_estado,
    });

    return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
  } catch (error) {
    next(error);
  }
};
