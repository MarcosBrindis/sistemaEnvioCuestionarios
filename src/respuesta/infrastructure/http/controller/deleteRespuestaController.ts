import { Request, Response } from 'express';
import { respuestaRepository } from '../../../infrastructure/dependencies';

export const deleteRespuestaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await respuestaRepository.delete(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
