import { Request, Response, NextFunction } from 'express';
import { GetCohortesDisponibles } from '../../../application/usecase/GetCohortesDisponibles';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getCohortesDisponiblesController = (getCohortesDisponibles: GetCohortesDisponibles) =>
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cohortes = await getCohortesDisponibles.execute();
      res.status(200).json({
        data: cohortes
      });
    } catch (error) {
      handleGetError(error as Error, _req, res, next);
    }
  };