import { registerClientUseCase } from '../../dependencies';
import { Request, Response, NextFunction } from 'express';
import { ClientNameAlreadyExistsError } from '../../../application/usecase/RegisterClientUseCase';

export async function RegisterClientController(req: Request, res: Response, next: NextFunction) {
  try {
    const { client_name } = req.body;
    const { apiKey, client } = await registerClientUseCase.execute(client_name);
    res.status(201).json({
      data: {
        id_client: client.id_client,
        client_name: client.client_name,
        api_key: apiKey,
        message: 'IMPORTANTE: Copie esta llave ahora. No podrá verla nuevamente.'
      }
    });
  } catch (err: any) {
    if (err instanceof ClientNameAlreadyExistsError) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}
