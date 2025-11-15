import { Request, Response, NextFunction } from 'express';
import { GetAllFormularios, GetFormularioById } from '../../../application/usecase/GetForm';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getFormulariosController = (
  getAllFormularios: GetAllFormularios,
  getFormularioById: GetFormularioById
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (id) {
      const numId = Number(id);
      if (isNaN(numId)) {
        res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID debe ser numérico' }});
        return;
      }
      const formulario = await getFormularioById.execute(numId);
      if (!formulario) {
        res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Formulario no encontrado' }});
        return;
      }

      res.status(200).json({
        data: {
          type: 'formularios',
          id: formulario.id_formulario?.toString(),
          attributes: {
            titulo: formulario.titulo,
            descripcion: formulario.descripcion,
            is_active: formulario.is_active,
            fecha_creacion: formulario.fecha_creacion
          },
          relationships: {
            preguntas: {
              data: formulario.preguntas?.map(p => ({
                type: 'pregunta',
                id: p.id_pregunta.toString(),
                attributes: { orden: p.orden }
              })) || []
            }
          }
        }
      });
      return;
    }

    const all = await getAllFormularios.execute();
    res.status(200).json({
      data: all.map(f => ({
        type: 'formularios',
        id: f.id_formulario?.toString(),
        attributes: {
          titulo: f.titulo,
          descripcion: f.descripcion,
          is_active: f.is_active,
          fecha_creacion: f.fecha_creacion
        }
      }))
    });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
