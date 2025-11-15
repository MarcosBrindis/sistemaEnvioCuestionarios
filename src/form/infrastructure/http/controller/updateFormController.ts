import { Request, Response, NextFunction } from 'express';
import { UpdateFormulario } from '../../../application/usecase/UpdateForm';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';

export const updateFormularioController = (updateFormulario: UpdateFormulario) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.body.data || !req.body.data.attributes) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado' }});
      return;
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID debe ser numérico' }});
      return;
    }

    const attrs = req.body.data.attributes;
    const payload: any = {};
    if (attrs.titulo !== undefined) payload.titulo = attrs.titulo;
    if (attrs.descripcion !== undefined) payload.descripcion = attrs.descripcion;
    if (attrs.is_active !== undefined) payload.is_active = attrs.is_active;

    const updated = await updateFormulario.execute(id, payload);

    res.status(200).json({
      data: {
        type: 'formularios',
        id: updated.id_formulario?.toString(),
        attributes: {
          titulo: updated.titulo,
          descripcion: updated.descripcion,
          is_active: updated.is_active,
          fecha_creacion: updated.fecha_creacion
        }
      }
    });
  } catch (error: any) {
    if (error.message.includes('No existe') || error.message.includes('no existe')) {
      res.status(404).json({ error: { status: '404', title: 'Not Found', detail: error.message }});
    } else if (error.message.includes('Ya existe')) {
      res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message }});
    } else {
      handleUpdateError(error, req, res, next);
    }
  }
};
