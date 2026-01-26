import { Request, Response, NextFunction } from 'express';
import { GenerateSurveyReportUseCase } from '../../../application/usecase/GenerateSurveyReportUseCase';

export class GetSurveyStatsController {
  constructor(private useCase: GenerateSurveyReportUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id_encuesta);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const data = await this.useCase.execute(id);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}
