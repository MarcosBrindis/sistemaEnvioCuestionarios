import { Request, Response } from 'express';
import { egresadoRepository } from '../../dependencies';
import { GetEgresadoSinopsis } from '../../../application/usecase/GetEgresadoSinopsis';

export const getEgresadoSinopsisController = async (req: Request, res: Response) => {
  try {
    const idEgresado = Number(req.params.id);

    const usecase = new GetEgresadoSinopsis(egresadoRepository);
    const result = await usecase.execute(idEgresado);

    res.status(200).json({
      data: {
        type: 'egresados-sinopsis',
        id: String(idEgresado),
        attributes: {
          sinopsis: result.sinopsis,
        },
      },
    });
  } catch (error: any) {
    if (error.message === 'Egresado no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
