import { Request, Response, NextFunction } from 'express';
import { GetEgresadoWithAchievements } from '../../../application/usecase/GetEgresadoWithAchievements';

export const getEgresadoWithAchievementsController = (useCase: GetEgresadoWithAchievements) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idEgresado = parseInt(req.params.id);

      if (isNaN(idEgresado)) {
        return res.status(400).json({
          success: false,
          message: 'El ID del egresado debe ser un número válido'
        });
      }

      const result = await useCase.execute(idEgresado);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      if (error.message === 'Egresado no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  };
};
