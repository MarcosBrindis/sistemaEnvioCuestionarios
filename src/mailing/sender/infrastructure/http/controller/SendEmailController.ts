import { Request, Response, NextFunction } from 'express';
import { EnqueueEmailUseCase } from '../../../application/usecase/EnqueueEmailUseCase';

export class SendEmailController {
  constructor(private enqueueEmailUseCase: EnqueueEmailUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const { to, subject, html, text } = req.body;
      const result = await this.enqueueEmailUseCase.execute({ to, subject, html, text });
      res.status(202).json({
        data: {
          job_id: result.jobId,
          status: 'queued',
          message: 'El correo ha sido aceptado y está en cola de envío.'
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
