// Dependencias del módulo de autenticación
import { AuthRepositoryMySQL } from './database/mysql/AuthRepositoryMySQL';
import { LoginEgresado } from '../application/usecase/LoginEgresado';
import { LogoutEgresado } from '../application/usecase/LogoutEgresado';
import { GetSessionInfo } from '../application/usecase/GetSessionInfo';

export const authRepository = new AuthRepositoryMySQL();
export const loginEgresadoUsecase = new LoginEgresado(authRepository);
export const logoutEgresadoUsecase = new LogoutEgresado();
export const getSessionInfoUsecase = new GetSessionInfo();
