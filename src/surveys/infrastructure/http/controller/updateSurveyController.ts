import { Request, Response, NextFunction } from 'express';
import { UpdateSurvey } from '../../../application/usecase/UpdateSurvey';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';

export const updateSurveyController = (updateSurvey: UpdateSurvey) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { data } = req.body;
    if (!data || !data.attributes) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON:API requerido' } });
      return;
    }
    const updateData: any = {};
    if (data.attributes.nombre) updateData.name = data.attributes.nombre;
    if (data.attributes.descripcion) updateData.description = data.attributes.descripcion;
    if (typeof data.attributes.is_active === 'boolean') updateData.isActive = data.attributes.is_active;
    if (data.relationships && data.relationships.formulario) updateData.formId = Number(data.relationships.formulario.data.id);
    if (data.relationships && data.relationships['template-correo']) updateData.templateId = Number(data.relationships['template-correo'].data.id);
    const survey = await updateSurvey.execute(id, updateData);
    if (!survey) {
      res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Survey not found' } });
      return;
    }
    res.status(200).json({ data: { type: 'encuestas', id: survey.id.toString(), attributes: { nombre: survey.name, descripcion: survey.description, is_active: survey.isActive }, relationships: { formulario: { data: { type: 'formularios', id: survey.formId } }, 'template-correo': { data: { type: 'templates-correo', id: survey.templateId } } } } });
  } catch (error) {
    handleUpdateError(error as Error, req, res, next);
  }
};
