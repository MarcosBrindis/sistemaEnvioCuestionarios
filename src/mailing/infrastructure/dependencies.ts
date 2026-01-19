import { MysqlEmailAccountRepository } from './database/mysql/MysqlEmailAccountRepository';
import { CreateAccountUseCase } from '../application/usecase/CreateAccountUseCase';
import { GetAccountsUseCase } from '../application/usecase/GetAccountsUseCase';
import { UpdateAccountUseCase } from '../application/usecase/UpdateAccountUseCase';
import { DeleteAccountUseCase } from '../application/usecase/DeleteAccountUseCase';

const emailAccountRepository = new MysqlEmailAccountRepository();
const createAccountUseCase = new CreateAccountUseCase(emailAccountRepository);
const getAccountsUseCase = new GetAccountsUseCase(emailAccountRepository);
const updateAccountUseCase = new UpdateAccountUseCase(emailAccountRepository);
const deleteAccountUseCase = new DeleteAccountUseCase(emailAccountRepository);

export const mailingDependencies = {
  createAccountUseCase,
  getAccountsUseCase,
  updateAccountUseCase,
  deleteAccountUseCase,
};
