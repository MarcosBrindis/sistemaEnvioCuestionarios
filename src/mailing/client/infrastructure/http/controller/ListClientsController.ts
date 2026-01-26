import { listClientsUseCase } from '../../dependencies';
import { Request, Response, NextFunction } from 'express';

export async function ListClientsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const clients = await listClientsUseCase.execute();
    res.status(200).json({ data: clients });
  } catch (err) {
    next(err);
  }
}
