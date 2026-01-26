import { Request, Response, NextFunction } from 'express';
import { GetPublicSurveyByUuid } from '../../../application/usecase/GetPublicSurveyByUuid';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getPublicSurveyByUuidController = (getPublicSurveyByUuid: GetPublicSurveyByUuid) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uuid = String(req.params.uuid || '').trim();
      if (!uuid) {
        res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'UUID requerido' } });
        return;
      }

      const payload = await getPublicSurveyByUuid.execute(uuid);
      if (!payload) {
        res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Acceso no encontrado' } });
        return;
      }

      if (!payload.access_active) {
        res.status(403).json({ error: { status: '403', title: 'Forbidden', detail: 'Acceso revocado' } });
        return;
      }

      res.status(200).json({ data: payload });
    } catch (error) {
      handleGetError(error as Error, req, res, next);
    }
  };
