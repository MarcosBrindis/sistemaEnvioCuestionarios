import { Request, Response, NextFunction } from 'express';
import { BuscarEgresadosPorFiltro } from '../../../application/usecase/BuscarEgresadosPorFiltro';

export const buscarEgresadosController = (buscarEgresadosPorFiltro: BuscarEgresadosPorFiltro) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawEstatus = Array.isArray(req.query.estatus) ? req.query.estatus[0] : req.query.estatus;
      const normalizedEstatus = rawEstatus !== undefined ? String(rawEstatus).trim() : undefined;
      const parsedEstatus = normalizedEstatus !== undefined ? Number(normalizedEstatus) : undefined;
      const estatus = normalizedEstatus
        ? (Number.isNaN(parsedEstatus) ? normalizedEstatus : parsedEstatus)
        : undefined;

      const filtros = {
        id_programa_educativo: req.query.id_programa_educativo ? Number(req.query.id_programa_educativo) : undefined,
        id_periodo_egreso: req.query.id_periodo_egreso ? Number(req.query.id_periodo_egreso) : undefined,
        cohorte: req.query.cohorte ? Number(req.query.cohorte) : undefined,
        prefijo_matricula: req.query.prefijo_matricula ? String(req.query.prefijo_matricula) : undefined,
        estatus,
        busqueda: req.query.busqueda as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20
      };
      const resultado = await buscarEgresadosPorFiltro.execute(filtros);
      res.status(200).json({
        data: resultado.data,
        meta: {
          total: resultado.total,
          page: resultado.page,
          limit: resultado.limit
        }
      });
    } catch (error) {
      next(error);
    }
  };
