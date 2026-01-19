import { Router } from 'express';
import { sendEmailController } from '../../dependencies';
import { ApiKeyMiddleware } from '../../../../shared/middleware/ApiKeyMiddleware';

const router = Router();

router.post('/send', ApiKeyMiddleware, sendEmailController.run.bind(sendEmailController));

export default router;
