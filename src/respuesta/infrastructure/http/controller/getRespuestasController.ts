import { Request, Response } from 'express';
import { respuestaRepository } from '../../../infrastructure/dependencies';

export const getRespuestasController = async (req: Request, res: Response) => {
  try {
    const { id_formulario, id_egresado } = req.query;
    const filtros: any = {};
    if (id_formulario) filtros.id_formulario = Number(id_formulario);
    if (id_egresado) filtros.id_egresado = Number(id_egresado);
    const respuestas = await respuestaRepository.findAll(filtros);
    res.json(respuestas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
