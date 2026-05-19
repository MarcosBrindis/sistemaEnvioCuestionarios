import { Request, Response, NextFunction } from 'express';
import { DispatchSurveyRemindersUseCase } from '../../../application/usecase/DispatchSurveyRemindersUseCase';

export class DispatchController {
  constructor(private useCase: DispatchSurveyRemindersUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_encuesta, id_template, filtro, id_group } = req.body;
      
      // Validar que id_group sea obligatorio
      if (id_group === undefined || id_group === null) {
        return res.status(400).json({ 
          error: { 
            status: '400', 
            title: 'Bad Request', 
            detail: 'id_group es requerido. Debes especificar el grupo al cual enviar la encuesta.' 
          } 
        });
      }

      const result = await this.useCase.execute({
        id_encuesta: Number(id_encuesta),
        id_template: Number(id_template),
        filtro,
        id_group: Number(id_group)
      });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}
