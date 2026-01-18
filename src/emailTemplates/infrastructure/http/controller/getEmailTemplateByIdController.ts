import { Request, Response, NextFunction } from 'express';
import { GetEmailTemplateById } from '../../../application/usecase/GetEmailTemplateById';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getEmailTemplateByIdController = (getEmailTemplateById: GetEmailTemplateById) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const template = await getEmailTemplateById.execute(id);
    if (!template) {
      res.status(404).json({
        error: {
          status: '404',
          title: 'Not Found',
          detail: 'Email template not found'
        }
      });
      return;
    }
    res.status(200).json({
      data: {
        type: 'templates-correo',
        id: template.id.toString(),
        attributes: {
          subject: template.subject,
          body: template.body
        },
        relationships: {
          tipo_correo: { data: { type: 'tipo_correo', id: template.typeId } }
        }
      }
    });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
