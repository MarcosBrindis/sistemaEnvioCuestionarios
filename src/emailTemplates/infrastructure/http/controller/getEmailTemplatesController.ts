import { Request, Response, NextFunction } from 'express';
import { GetEmailTemplates } from '../../../application/usecase/GetEmailTemplates';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getEmailTemplatesController = (getEmailTemplates: GetEmailTemplates) => async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templates = await getEmailTemplates.execute();
    res.status(200).json({
      data: templates.map(t => ({
        type: 'templates-correo',
        id: t.id.toString(),
        attributes: {
          subject: t.subject,
          body: t.body
        },
        relationships: {
          tipo_correo: { data: { type: 'tipo_correo', id: t.typeId } }
        }
      }))
    });
  } catch (error) {
    handleGetError(error as Error, _req, res, next);
  }
};
