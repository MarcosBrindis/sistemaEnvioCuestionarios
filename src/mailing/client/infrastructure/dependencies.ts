import { MysqlApiClientRepository } from './database/mysql/MysqlApiClientRepository';
import { RegisterClientUseCase } from '../application/usecase/RegisterClientUseCase';
import { ListClientsUseCase } from '../application/usecase/ListClientsUseCase';
import { RotateKeyUseCase } from '../application/usecase/RotateKeyUseCase';
import { RevokeClientUseCase } from '../application/usecase/RevokeClientUseCase';

import { ActivateClientUseCase } from '../application/usecase/ActivateClientUseCase';

const apiClientRepository = new MysqlApiClientRepository();

export const registerClientUseCase = new RegisterClientUseCase(apiClientRepository);
export const listClientsUseCase = new ListClientsUseCase(apiClientRepository);
export const rotateKeyUseCase = new RotateKeyUseCase(apiClientRepository);
export const revokeClientUseCase = new RevokeClientUseCase(apiClientRepository);
export const activateClientUseCase = new ActivateClientUseCase(apiClientRepository);
