import { AuthRepositoryMySQL } from './database/mysql/AuthRepositoryMySQL';
import { LoginEgresado } from '../application/usecase/LoginEgresado';
import { LoginStaff } from '../application/usecase/LoginStaff';
import { LogoutEgresado } from '../application/usecase/LogoutEgresado';
import { GetSessionInfo } from '../application/usecase/GetSessionInfo';

export const authRepository = new AuthRepositoryMySQL();
export const loginEgresadoUsecase = new LoginEgresado(authRepository);
export const loginStaffUsecase = new LoginStaff(authRepository);
export const logoutEgresadoUsecase = new LogoutEgresado();
export const getSessionInfoUsecase = new GetSessionInfo();
