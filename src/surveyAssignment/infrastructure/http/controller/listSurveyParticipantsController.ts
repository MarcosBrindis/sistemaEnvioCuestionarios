import { Request, Response, NextFunction } from 'express';
import { ListSurveyParticipants } from '../../../application/usecase/ListSurveyParticipants';
// import { errorHandler } from '../../../../core/middleware/errorHandler';

export const listSurveyParticipantsController = (listSurveyParticipants: ListSurveyParticipants) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idEncuesta = Number(req.params.id);
    const { page = 1, limit = 10, filtro_acceso, estado_respuesta, busqueda } = req.query;
    const options = {
      page: Number(page),
      limit: Number(limit),
      filtro_acceso: filtro_acceso as string,
      estado_respuesta: estado_respuesta as string,
      busqueda: busqueda as string,
    };
    const result = await listSurveyParticipants.execute(idEncuesta, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
