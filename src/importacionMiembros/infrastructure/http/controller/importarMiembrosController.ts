import { Request, Response, NextFunction } from 'express';
import { ImportarMiembrosPorFiltro } from '../../../application/usecase/ImportarMiembrosPorFiltro';

export const importarMiembrosController = (importarMiembrosPorFiltro: ImportarMiembrosPorFiltro) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idGrupo = Number(req.params.id);
      const filtros = req.body?.data?.attributes?.filtros || {};
      const resultado = await importarMiembrosPorFiltro.execute(idGrupo, filtros);
      res.status(200).json({
        data: {
          type: 'importacion-masiva',
          attributes: resultado
        }
      });
    } catch (error) {
      next(error);
    }
  };
