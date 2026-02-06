import { Request, Response, NextFunction } from 'express';
import { SubmitPublicSurveyResponseUseCase } from '../../../application/usecase/SubmitPublicSurveyResponseUseCase';

export const submitPublicSurveyResponseController = (submitResponse: SubmitPublicSurveyResponseUseCase) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uuid = String(req.params.uuid || '').trim();
      const respuestas_json = req.body?.respuestas_json;

      if (!uuid) {
        res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'UUID requerido' } });
        return;
      }

      if (!respuestas_json) {
        res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Respuestas requeridas' } });
        return;
      }

      const result = await submitResponse.execute(uuid, respuestas_json);
      res.status(201).json({
        data: {
          id_respuesta: result.id_respuesta,
          mensaje: result.mensaje
        }
      });
    } catch (error: any) {
      if (error.message === 'Acceso no encontrado') {
        res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Encuesta no encontrada' } });
        return;
      }
      if (error.message === 'Acceso revocado') {
        res.status(403).json({ error: { status: '403', title: 'Forbidden', detail: 'Acceso revocado' } });
        return;
      }
      if (error.message.includes('ya respondió')) {
        res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message } });
        return;
      }
      next(error);
    }
  };
