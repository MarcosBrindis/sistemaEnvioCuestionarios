import { Request, Response, NextFunction } from 'express';
import { CreateFormulario } from '../../../application/usecase/CreateForm';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createFormularioController = (createFormulario: CreateFormulario) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.body.data || !req.body.data.attributes) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado' }});
      return;
    }

    const attrs = req.body.data.attributes;
    const titulo = attrs.titulo;
    const descripcion = attrs.descripcion ?? null;
    const is_active = attrs.is_active;

    const created = await createFormulario.execute({ titulo, descripcion, is_active });

    res.status(201).json({
      data: {
        type: 'formularios',
        id: created.id_formulario?.toString(),
        attributes: {
          titulo: created.titulo,
          descripcion: created.descripcion,
          is_active: created.is_active,
          fecha_creacion: created.fecha_creacion
        }
      }
    });
  } catch (error: any) {
    // Map basic messages to codes similarly a otros controladores
    if (error.message.includes('obligatorio') || error.message.includes('vacío') || error.message.includes('is_active')) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: error.message }});
    } else if (error.message.includes('Ya existe')) {
      res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message }});
    } else {
      handlePostError(error, req, res, next);
    }
  }
};
