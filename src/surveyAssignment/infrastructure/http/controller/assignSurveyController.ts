import { Request, Response, NextFunction } from 'express';
import { AssignSurvey } from '../../../application/usecase/AssignSurvey';
// import { errorHandler } from '../../../../core/middleware/errorHandler';

export const assignSurveyController = (assignSurvey: AssignSurvey) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idEncuesta = Number(req.params.id);
    const { data } = req.body;
    if (!data || !data.attributes) {
      return res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON:API requerido' } });
    }
    let egresados: number[] = [];
    if (Array.isArray(data.attributes.lista_egresados)) {
      egresados = data.attributes.lista_egresados;
      const result = await assignSurvey.execute(idEncuesta, egresados);
      return res.status(200).json({ meta: result });
    } else if (data.attributes.id_group) {
      // Redirigir a la lógica de grupo
      req.body = { data: { attributes: { id_group: data.attributes.id_group } } };
      // Llama al controlador de grupo (de forma programática)
      // Necesitamos acceso a assignSurveyGroup, así que lo pasamos como dependencia
      // Esto requiere que el router pase ambas dependencias o que el controlador de grupo sea llamado aquí
      // Para simplicidad, replicamos la lógica aquí:
      const { assignmentDependencies } = require('../../dependencies');
      const assignSurveyGroup = assignmentDependencies.assignSurveyGroup;
      const idGroup = Number(data.attributes.id_group);
      const result = await assignSurveyGroup.execute(idEncuesta, idGroup);
      return res.status(200).json({ meta: result });
    } else {
      return res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Debes enviar lista_egresados o id_group' } });
    }
  } catch (error) {
    // Puedes usar el middleware de Express para manejo de errores
    next(error);
  }
};
