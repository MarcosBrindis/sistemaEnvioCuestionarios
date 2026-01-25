import { Request, Response, NextFunction } from 'express';
import { CreateEmailTemplate } from '../../../application/usecase/CreateEmailTemplate';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const createEmailTemplateController = (createEmailTemplate: CreateEmailTemplate) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const { asunto, cuerpo, layout_html } = req.body.data.attributes;
    const typeId = Number(req.body.data.relationships.tipo_correo.data.id);
    const template = await createEmailTemplate.execute({
      subject: asunto,
      body: cuerpo,
      layoutHtml: layout_html ?? null,
      typeId
    });
    res.status(201).json({
      data: {
        type: 'templates-correo',
        id: template.id.toString(),
        attributes: {
          subject: template.subject,
          body: template.body,
          layout_html: template.layoutHtml ?? null
        },
        relationships: {
          tipo_correo: { data: { type: 'tipo_correo', id: template.typeId } }
        }
      }
    });
  } catch (error) {
    handlePostError(error as Error, req, res, next);
  }
};
