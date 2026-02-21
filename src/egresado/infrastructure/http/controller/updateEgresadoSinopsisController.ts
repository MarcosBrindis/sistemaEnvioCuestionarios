import { Request, Response } from 'express';
import { egresadoRepository } from '../../dependencies';
import { UpdateEgresadoSinopsis } from '../../../application/usecase/UpdateEgresadoSinopsis';

export const updateEgresadoSinopsisController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Cuerpo de solicitud inválido' });
    }

    const attrs = data.attributes || {};

    const usecase = new UpdateEgresadoSinopsis(egresadoRepository);
    const actualizado = await usecase.execute(idEgresado, {
      sinopsis: attrs.sinopsis ?? undefined,
    });

    res.status(200).json({
      data: {
        type: 'egresados',
        id: String(actualizado.id_egresado),
        attributes: {
          nombre: actualizado.nombre,
          primer_apellido: actualizado.primer_apellido,
          segundo_apellido: actualizado.segundo_apellido,
          matricula: actualizado.matricula,
          curp: actualizado.curp,
          email: actualizado.email,
          imagen_egresado: actualizado.imagen_egresado,
          sinopsis: actualizado.sinopsis,
          fecha_nacimiento: actualizado.fecha_nacimiento,
          is_active: actualizado.is_active,
          id_estado: actualizado.id_estado,
          id_programa_educativo: actualizado.id_programa_educativo,
          id_periodo: actualizado.id_periodo,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
