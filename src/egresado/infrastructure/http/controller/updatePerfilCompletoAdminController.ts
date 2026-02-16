import { Request, Response, NextFunction } from 'express';
import { UpdatePerfilCompletoAdmin } from '../../../application/usecase/UpdatePerfilCompletoAdmin';
import { UploadFile } from '../../../../files/application/usecase/UploadFile';

export const updatePerfilCompletoAdminController = (
  updatePerfilCompletoAdmin: UpdatePerfilCompletoAdmin,
  uploadFile: UploadFile
) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const egresadoId = Number(req.params.id);

    const bodyData = req.body?.data;
    const parsedData = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;
    const attrs = parsedData?.attributes || {};

    const nombre = attrs.nombre ?? req.body.nombre;
    const primer_apellido = attrs.primer_apellido ?? req.body.primer_apellido;
    const segundo_apellido = attrs.segundo_apellido ?? req.body.segundo_apellido;
    const email = attrs.email ?? req.body.email;
    const fecha_nacimiento = attrs.fecha_nacimiento ?? req.body.fecha_nacimiento;

    let imagen_egresado = attrs.imagen_egresado ?? req.body.imagen_egresado;

    const idProgramaRaw = attrs.id_programa_educativo ?? req.body.id_programa_educativo;
    const idPeriodoRaw = attrs.id_periodo ?? req.body.id_periodo;
    const idEstadoRaw = attrs.id_estado ?? req.body.id_estado;

    const id_programa_educativo = idProgramaRaw !== undefined && idProgramaRaw !== ''
      ? Number(idProgramaRaw)
      : undefined;
    const id_periodo = idPeriodoRaw !== undefined && idPeriodoRaw !== ''
      ? Number(idPeriodoRaw)
      : undefined;
    const id_estado = idEstadoRaw !== undefined && idEstadoRaw !== ''
      ? Number(idEstadoRaw)
      : undefined;

    if (req.file) {
      const fileId = await uploadFile.execute(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        req.file.size
      );
      imagen_egresado = `${req.protocol}://${req.get('host')}/api/files/${fileId}`;
    }

    const result = await updatePerfilCompletoAdmin.execute({
      id: egresadoId,
      nombre,
      primer_apellido,
      segundo_apellido,
      email,
      fecha_nacimiento,
      imagen_egresado,
      id_programa_educativo: Number.isNaN(id_programa_educativo as number) ? undefined : id_programa_educativo,
      id_periodo: Number.isNaN(id_periodo as number) ? undefined : id_periodo,
      id_estado: Number.isNaN(id_estado as number) ? undefined : id_estado,
    });

    return res.json({ data: { type: 'egresados', id: result.id_egresado, attributes: result } });
  } catch (error) {
    next(error);
  }
};
