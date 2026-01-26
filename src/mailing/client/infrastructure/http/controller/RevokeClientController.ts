import { revokeClientUseCase } from '../../dependencies';
import { Request, Response, NextFunction } from 'express';

export async function RevokeClientController(req: Request, res: Response, next: NextFunction) {
  try {
    const id_client = parseInt(req.params.id, 10);
    await revokeClientUseCase.execute(id_client);
    res.status(200).json({ message: 'Cliente revocado correctamente.' });
  } catch (err) {
    next(err);
  }
}
