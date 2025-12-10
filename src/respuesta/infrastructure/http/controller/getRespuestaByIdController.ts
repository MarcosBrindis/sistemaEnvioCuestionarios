
import { Request, Response } from 'express';
import { respuestaRepository } from '../../../infrastructure/dependencies';

export const getRespuestaByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const respuesta = await respuestaRepository.findById(id);
    if (!respuesta) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    const data = {
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
    };
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
