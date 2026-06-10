import { Request, Response, NextFunction } from 'express';
import { UpdateEmailTemplate } from '../../../application/usecase/UpdateEmailTemplate';
import { handleUpdateError } from '../../../../core/middleware/errorHandler';
import { replaceBackendUrl } from '../../../../core/utils/templateUtils';

export const updateEmailTemplateController = (updateEmailTemplate: UpdateEmailTemplate) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.body.data || !req.body.data.attributes || !req.body.data.relationships || !req.body.data.relationships.tipo_correo) {
      res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'The format must follow JSON:API specification'
        }
      });
      return;
    }
    const id = Number(req.params.id);
    const { asunto, cuerpo, layout_html } = req.body.data.attributes;
    const typeId = Number(req.body.data.relationships.tipo_correo.data.id);
    const template = await updateEmailTemplate.execute(id, {
      subject: asunto,
      body: cuerpo,
      layoutHtml: layout_html ?? null,
      typeId
    });
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
          body: replaceBackendUrl(template.body),
          layout_html: replaceBackendUrl(template.layoutHtml)
        },
        relationships: {
          tipo_correo: { data: { type: 'tipo_correo', id: template.typeId } }
        }
      }
    });
  } catch (error) {
    handleUpdateError(error as Error, req, res, next);
  }
};
