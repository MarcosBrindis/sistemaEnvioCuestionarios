import { Request, Response, NextFunction } from 'express';
import { DispatchBirthdayCongratsUseCase } from '../../../application/usecase/DispatchBirthdayCongratsUseCase';

export class DispatchBirthdayTestController {
  constructor(private useCase: DispatchBirthdayCongratsUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyTemplateId = req.body?.id_template;
      const envTemplateId = process.env.BIRTHDAY_TEMPLATE_ID;
      const id_template = Number(bodyTemplateId ?? envTemplateId);

      if (!id_template || Number.isNaN(id_template)) {
        throw new Error('Configura BIRTHDAY_TEMPLATE_ID o envia id_template en el body.');
      }

      const targetEgresadoIds = Array.isArray(req.body?.target_egresado_ids)
        ? req.body.target_egresado_ids
            .map((id: unknown) => Number(id))
            .filter((id: number) => Number.isInteger(id) && id > 0)
        : [];

      const targetEmails = Array.isArray(req.body?.target_emails)
        ? req.body.target_emails
            .map((email: unknown) => String(email).trim())
            .filter((email: string) => email.length > 0)
        : [];

      if (targetEgresadoIds.length === 0 && targetEmails.length === 0) {
        throw new Error('Envia al menos un destino de prueba en target_egresado_ids o target_emails.');
      }

      const result = await this.useCase.execute({
        id_template,
        targetEgresadoIds,
        targetEmails
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}
