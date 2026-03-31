import { Router } from 'express';
import {
	dispatchBirthdayController,
	dispatchBirthdayTestController,
	dispatchController
} from '../../dependencies';

const router = Router();

router.post('/dispatch', dispatchController.run.bind(dispatchController));
router.post('/dispatch-birthday', dispatchBirthdayController.run.bind(dispatchBirthdayController));
router.post('/dispatch-birthday-test', dispatchBirthdayTestController.run.bind(dispatchBirthdayTestController));

export default router;
