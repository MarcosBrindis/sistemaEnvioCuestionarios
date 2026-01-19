import { rotateKeyUseCase } from '../../dependencies';
import { Request, Response, NextFunction } from 'express';
import { ClientNotFoundError } from '../../../application/usecase/RotateKeyUseCase';

export async function RotateKeyController(req: Request, res: Response, next: NextFunction) {
  try {
    const id_client = parseInt(req.params.id, 10);
    const { newApiKey, client_name } = await rotateKeyUseCase.execute(id_client);
    res.status(200).json({
      data: {
        id_client,
        client_name,
        new_api_key: newApiKey,
        message: 'La llave anterior ha sido invalidada inmediatamente.'
      }
    });
  } catch (err: any) {
    if (err instanceof ClientNotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    if (err instanceof Error && err.message.includes('inactivo')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}
