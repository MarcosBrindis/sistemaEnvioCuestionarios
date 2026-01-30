import { Request, Response, NextFunction } from 'express';
import { UpdatePerfilCompleto } from '../../../application/usecase/UpdatePerfilCompleto';

export const updatePerfilCompletoController = (updatePerfilCompleto: UpdatePerfilCompleto) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const egresadoId = Number(req.params.id);
    const sessionEgresadoId = req.session.user?.id;

    if (!sessionEgresadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (egresadoId !== sessionEgresadoId) {
      return res.status(403).json({ error: 'No autorizado para editar este perfil' });
    }

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

    const result = await updatePerfilCompleto.execute({
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
      sessionEgresadoId,
    });

    return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
  } catch (error) {
    next(error);
  }
};
