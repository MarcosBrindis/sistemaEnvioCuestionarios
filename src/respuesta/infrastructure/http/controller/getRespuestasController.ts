
import { Request, Response } from 'express';
import { respuestaRepository } from '../../../infrastructure/dependencies';

export const getRespuestasController = async (req: Request, res: Response) => {
  try {
    const { id_formulario, id_egresado } = req.query;
    const filtros: any = {};
    if (id_formulario) filtros.id_formulario = Number(id_formulario);
    if (id_egresado) filtros.id_egresado = Number(id_egresado);
    const respuestas = await respuestaRepository.findAll(filtros);
    const data = respuestas.map((respuesta: any) => ({
      type: 'respuestas',
      id: String(respuesta.id_respuesta),
      attributes: {
        fecha_respuesta: respuesta.fecha_respuesta,
        respuestas_json: respuesta.respuestas_json,
      },
      relationships: {
        egresado: {
          data: { type: 'egresados', id: String(respuesta.id_egresado) }
        },
        encuesta: {
          data: { type: 'encuestas', id: String(respuesta.id_formulario) }
        }
      }
    }));
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
