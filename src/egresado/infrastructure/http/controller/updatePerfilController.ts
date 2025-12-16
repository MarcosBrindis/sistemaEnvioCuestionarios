import { Request, Response, NextFunction } from 'express';
import { UpdateEgresadoPerfil } from '../../../application/usecase/UpdateEgresadoPerfil';

export const updatePerfilController = (updateEgresadoPerfil: UpdateEgresadoPerfil) => async (
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
    const { email, fecha_nacimiento, imagen_egresado } = req.body.data?.attributes || {};
    const result = await updateEgresadoPerfil.execute({
      id: egresadoId,
      email,
      fecha_nacimiento,
      imagen_egresado,
      sessionEgresadoId,
    });
    return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
  } catch (error) {
    next(error);
  }
};
