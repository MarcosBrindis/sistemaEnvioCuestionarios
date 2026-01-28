import { Request, Response, NextFunction } from 'express';
import { GetAllEgresadosWithAchievements } from '../../../application/usecase/GetAllEgresadosWithAchievements';

export const getAllEgresadosWithAchievementsController = (useCase: GetAllEgresadosWithAchievements) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await useCase.execute();

      return res.status(200).json({
        success: true,
        data: result,
        total: result.length
      });
    } catch (error: any) {
      next(error);
    }
  };
};
