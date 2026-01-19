import { Router } from 'express';
import { getSurveyStatsController } from '../../dependencies';

const router = Router();

router.get('/survey/:id_encuesta', getSurveyStatsController.run.bind(getSurveyStatsController));

export default router;
