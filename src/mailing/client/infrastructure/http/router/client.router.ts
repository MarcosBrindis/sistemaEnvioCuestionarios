import { Router } from 'express';
import { RegisterClientController } from '../controller/RegisterClientController';
import { ListClientsController } from '../controller/ListClientsController';
import { RotateKeyController } from '../controller/RotateKeyController';
import { RevokeClientController } from '../controller/RevokeClientController';

import { ActivateClientController } from '../controller/ActivateClientController';

const router = Router();

router.post('/clients', RegisterClientController);
router.get('/clients', ListClientsController);
router.patch('/clients/:id/rotate', RotateKeyController);
router.patch('/clients/:id/revoke', RevokeClientController);

router.patch('/clients/:id/activate', ActivateClientController);

export default router;
