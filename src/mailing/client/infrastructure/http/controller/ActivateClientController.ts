import { activateClientUseCase } from '../../dependencies';
import { Request, Response, NextFunction } from 'express';

export async function ActivateClientController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const client = await activateClientUseCase.execute(id);
    res.status(200).json({ data: client });
  } catch (err) {
    next(err);
  }
}
