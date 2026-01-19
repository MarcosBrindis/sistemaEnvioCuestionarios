import { Router } from 'express';
import { dispatchController } from '../../dependencies';

const router = Router();

router.post('/dispatch', dispatchController.run.bind(dispatchController));

export default router;
