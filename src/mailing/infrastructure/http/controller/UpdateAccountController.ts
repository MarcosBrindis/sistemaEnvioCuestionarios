import { Request, Response, NextFunction } from 'express';
import { UpdateAccountUseCase } from '../../../application/usecase/UpdateAccountUseCase';

export const UpdateAccountController = (usecase: UpdateAccountUseCase) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await usecase.execute(id, req.body);
    res.status(200).json({ data: result, message: 'Configuración actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};
