import { Request, Response, NextFunction } from 'express';
import { GetEmailTemplates } from '../../../application/usecase/GetEmailTemplates';
import { handleGetError } from '../../../../core/middleware/errorHandler';
import { replaceBackendUrl } from '../../../../core/utils/templateUtils';

export const getEmailTemplatesController = (getEmailTemplates: GetEmailTemplates) => async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templates = await getEmailTemplates.execute();
    res.status(200).json({
      data: templates.map(t => ({
        type: 'templates-correo',
        id: t.id.toString(),
        attributes: {
          subject: t.subject,
          body: replaceBackendUrl(t.body),
          layout_html: replaceBackendUrl(t.layoutHtml)
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
