import { Request, Response, NextFunction } from 'express';
import { UpdateEgresadoPerfil } from '../../../application/usecase/UpdateEgresadoPerfil';
import { UploadFile } from '../../../../files/application/usecase/UploadFile';

export const updatePerfilController = (
  updateEgresadoPerfil: UpdateEgresadoPerfil,
  uploadFile: UploadFile
) => async (
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

    const bodyData = req.body?.data;
    const parsedData = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;
    const attrs = parsedData?.attributes || {};

    const email = attrs.email ?? req.body.email;
    const fecha_nacimiento = attrs.fecha_nacimiento ?? req.body.fecha_nacimiento;

    let imagen_egresado = attrs.imagen_egresado ?? req.body.imagen_egresado;

    if (req.file) {
      const result = await uploadFile.execute(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        sessionEgresadoId
      );
      imagen_egresado = `${req.protocol}://${req.get('host')}/uploads/${result.relativePath}`;
    }

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
