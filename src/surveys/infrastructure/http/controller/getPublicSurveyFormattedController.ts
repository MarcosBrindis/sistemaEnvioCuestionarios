import { Request, Response, NextFunction } from 'express';
import { GetSurveyFormattedByUuid } from '../../../application/usecase/GetSurveyFormattedByUuid';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getPublicSurveyFormattedController = (getSurveyFormatted: GetSurveyFormattedByUuid) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uuid = String(req.params.uuid || '').trim();
      if (!uuid) {
        res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'UUID requerido' } });
        return;
      }

      const payload = await getSurveyFormatted.execute(uuid);
      if (!payload) {
        res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Encuesta no encontrada' } });
        return;
      }

      res.status(200).json(payload);
    } catch (error: any) {
      if (error.message === 'Acceso revocado') {
        res.status(403).json({ error: { status: '403', title: 'Forbidden', detail: 'Acceso revocado' } });
        return;
      }
      handleGetError(error as Error, req, res, next);
    }
  };
