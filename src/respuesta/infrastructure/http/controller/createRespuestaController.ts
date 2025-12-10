import { Request, Response } from 'express';
import { RegistrarRespuesta } from '../../../application/usecase/CreateRespuesta';
import { respuestaRepository } from '../../../infrastructure/dependencies';

const registrarRespuesta = new RegistrarRespuesta(respuestaRepository);

export const createRespuestaController = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data || data.type !== 'respuestas') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
    const respuestas_json = data.attributes?.respuestas_json;
    const egresadoId = data.relationships?.egresado?.data?.id;
    const formularioId = data.relationships?.encuesta?.data?.id;
    if (!egresadoId || !formularioId || !respuestas_json) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    const respuesta = await registrarRespuesta.execute({
      id_egresado: Number(egresadoId),
      id_formulario: Number(formularioId),
      respuestas_json,
    });
    res.status(201).json({
      data: {
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
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
