import { Request, Response, NextFunction } from 'express';
import { CreateSurvey } from '../../../application/usecase/CreateSurvey';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createSurveyController = (createSurvey: CreateSurvey) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data } = req.body;
    if (!data || !data.attributes || !data.relationships) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON:API requerido' } });
      return;
    }
    const { nombre, descripcion } = data.attributes;
    const formId = Number(data.relationships.formulario.data.id);
    const templateId = Number(data.relationships['template-correo'].data.id);
    const survey = await createSurvey.execute({ name: nombre, description: descripcion, isActive: true, formId, templateId });
    res.status(201).json({
      data: {
        type: 'encuestas',
        id: survey.id.toString(),
        attributes: {
          nombre: survey.name,
          descripcion: survey.description,
          is_active: survey.isActive
        },
        relationships: {
          formulario: { data: { type: 'formularios', id: survey.formId } },
          'template-correo': { data: { type: 'templates-correo', id: survey.templateId } }
        }
      }
    });
  } catch (error) {
    handlePostError(error as Error, req, res, next);
  }
};
