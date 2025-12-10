import { Request, Response } from 'express';
import { respuestaRepository } from '../../../infrastructure/dependencies';

export const getRespuestaByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const respuesta = await respuestaRepository.findById(id);
    if (!respuesta) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    res.json(respuesta);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
