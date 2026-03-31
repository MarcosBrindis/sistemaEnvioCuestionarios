import { Request, Response, NextFunction } from 'express';
import { DispatchBirthdayCongratsUseCase } from '../../../application/usecase/DispatchBirthdayCongratsUseCase';

export class DispatchBirthdayController {
  constructor(private useCase: DispatchBirthdayCongratsUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyTemplateId = req.body?.id_template;
      const envTemplateId = process.env.BIRTHDAY_TEMPLATE_ID;
      const id_template = Number(bodyTemplateId ?? envTemplateId);

      if (!id_template || Number.isNaN(id_template)) {
        throw new Error('Configura BIRTHDAY_TEMPLATE_ID o envia id_template en el body.');
      }

      const referenceDate = req.body?.reference_date ? new Date(req.body.reference_date) : undefined;
      if (referenceDate && Number.isNaN(referenceDate.getTime())) {
        throw new Error('reference_date debe tener formato YYYY-MM-DD.');
      }

      const result = await this.useCase.execute({ id_template, referenceDate });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}
