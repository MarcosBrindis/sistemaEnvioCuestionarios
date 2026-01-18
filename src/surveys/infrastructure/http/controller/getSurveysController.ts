import { Request, Response, NextFunction } from 'express';
import { GetSurveys } from '../../../application/usecase/GetSurveys';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getSurveysController = (getSurveys: GetSurveys) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, is_active, busqueda } = req.query;
    const params: any = { page: Number(page), limit: Number(limit) };
    if (is_active !== undefined) params.isActive = is_active === 'true';
    if (busqueda) params.search = String(busqueda);
    const result = await getSurveys.execute(params);
    res.status(200).json({ meta: result.meta, data: result.data.map(survey => ({ type: 'encuestas', id: survey.id.toString(), attributes: { nombre: survey.name, descripcion: survey.description, is_active: survey.isActive }, relationships: { formulario: { data: { type: 'formularios', id: survey.formId } }, 'template-correo': { data: { type: 'templates-correo', id: survey.templateId } } } })) });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
