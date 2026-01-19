import { Router } from 'express';
import { CreateAccountController } from '../controller/CreateAccountController';
import { UpdateAccountController } from '../controller/UpdateAccountController';
import { GetAccountsController } from '../controller/GetAccountsController';
import { DeleteAccountController } from '../controller/DeleteAccountController';
import { mailingDependencies } from '../../dependencies';

const router = Router();

router.post('/accounts', CreateAccountController(mailingDependencies.createAccountUseCase));
router.patch('/accounts/:id', UpdateAccountController(mailingDependencies.updateAccountUseCase));
router.get('/accounts', GetAccountsController(mailingDependencies.getAccountsUseCase));
router.delete('/accounts/:id', DeleteAccountController(mailingDependencies.deleteAccountUseCase));

export default router;
