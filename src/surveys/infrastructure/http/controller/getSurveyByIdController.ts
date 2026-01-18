import { Request, Response, NextFunction } from 'express';
import { GetSurveyById } from '../../../application/usecase/GetSurveyById';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getSurveyByIdController = (getSurveyById: GetSurveyById) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const survey = await getSurveyById.execute(id);
    if (!survey) {
      res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Survey not found' } });
      return;
    }
    res.status(200).json({ data: { type: 'encuestas', id: survey.id.toString(), attributes: { nombre: survey.name, descripcion: survey.description, is_active: survey.isActive }, relationships: { formulario: { data: { type: 'formularios', id: survey.formId } }, 'template-correo': { data: { type: 'templates-correo', id: survey.templateId } } } } });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
