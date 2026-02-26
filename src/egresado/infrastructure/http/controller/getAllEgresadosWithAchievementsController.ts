import { Request, Response, NextFunction } from 'express';
import { GetAllEgresadosWithAchievements } from '../../../application/usecase/GetAllEgresadosWithAchievements';
import { getDirectorProgramIds } from '../../../../core/middleware/authorization';

export const getAllEgresadosWithAchievementsController = (useCase: GetAllEgresadosWithAchievements) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await useCase.execute();
      const user = req.session?.user;

      if (user?.rol === 'director_programa_educativo') {
        const programIds = await getDirectorProgramIds(user.id);
        const scoped = result.filter((item: any) => {
          const idPrograma = item?.egresado?.id_programa_educativo;
          return typeof idPrograma === 'number' && programIds.includes(idPrograma);
        });

        return res.status(200).json({
          success: true,
          data: scoped,
          total: scoped.length
        });
      }

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
