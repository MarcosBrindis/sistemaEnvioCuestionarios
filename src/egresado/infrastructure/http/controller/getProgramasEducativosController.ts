import { Request, Response, NextFunction } from 'express';
import { GetProgramasEducativos } from '../../../application/usecase/GetProgramasEducativos';
import { handleGetError } from '../../../../core/middleware/errorHandler';

export const getProgramasEducativosController = (getProgramasEducativos: GetProgramasEducativos) =>
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const programas = await getProgramasEducativos.execute();
      res.status(200).json({
        data: programas
      });
    } catch (error) {
      handleGetError(error as Error, _req, res, next);
    }
  };
