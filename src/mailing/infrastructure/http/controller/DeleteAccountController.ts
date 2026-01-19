import { Request, Response, NextFunction } from 'express';
import { DeleteAccountUseCase } from '../../../application/usecase/DeleteAccountUseCase';

export const DeleteAccountController = (usecase: DeleteAccountUseCase) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await usecase.execute(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
