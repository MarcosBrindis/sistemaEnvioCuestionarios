import { Request, Response, NextFunction } from 'express';
import { DispatchSurveyRemindersUseCase } from '../../../application/usecase/DispatchSurveyRemindersUseCase';

export class DispatchController {
  constructor(private useCase: DispatchSurveyRemindersUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_encuesta, id_template, filtro, id_group } = req.body;
      const result = await this.useCase.execute({
        id_encuesta: Number(id_encuesta),
        id_template: Number(id_template),
        filtro,
        id_group: id_group !== undefined ? Number(id_group) : undefined
      });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}
