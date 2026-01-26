import { Request, Response, NextFunction } from 'express';
import { GetAccountsUseCase } from '../../../application/usecase/GetAccountsUseCase';

export const GetAccountsController = (usecase: GetAccountsUseCase) => async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usecase.execute();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
