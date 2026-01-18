import { Request, Response, NextFunction } from 'express';
import { AssignSurveyGroup } from '../../../application/usecase/AssignSurveyGroup';
// import { errorHandler } from '../../../../core/middleware/errorHandler';

export const assignSurveyGroupController = (assignSurveyGroup: AssignSurveyGroup) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idEncuesta = Number(req.params.id);
    const { data } = req.body;
    if (!data || !data.attributes || !data.attributes.id_group) {
      return res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Debes enviar id_group en attributes' } });
    }
    const idGroup = Number(data.attributes.id_group);
    const result = await assignSurveyGroup.execute(idEncuesta, idGroup);
    res.status(200).json({ meta: result });
  } catch (error) {
    next(error);
  }
};
