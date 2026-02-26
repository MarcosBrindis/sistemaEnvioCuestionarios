import { MysqlConnection } from '../../core/db/mysl/connection';
import { UsuariosInternosRepositoryMySQL } from './database/UsuariosInternosRepositoryMySQL';
import { CreateUsuarioInterno } from '../application/usecase/CreateUsuarioInterno';
import { GetUsuariosInternos } from '../application/usecase/GetUsuariosInternos';
import { GetUsuarioInternoById } from '../application/usecase/GetUsuarioInternoById';
import { UpdateUsuarioInterno } from '../application/usecase/UpdateUsuarioInterno';
import { ResetPasswordUsuarioInterno } from '../application/usecase/ResetPasswordUsuarioInterno';
import { DeactivateUsuarioInterno } from '../application/usecase/DeactivateUsuarioInterno';
import { AssignProgramsToDirector } from '../application/usecase/AssignProgramsToDirector';
import { GetUserPrograms } from '../application/usecase/GetUserPrograms';
import { RemoveUserProgram } from '../application/usecase/RemoveUserProgram';
import { GetRolesUsuariosInternos } from '../application/usecase/GetRolesUsuariosInternos';

export const usuariosInternosRepository = new UsuariosInternosRepositoryMySQL(MysqlConnection);

export const createUsuarioInternoUsecase = new CreateUsuarioInterno(
  usuariosInternosRepository
);
export const getUsuariosInternosUsecase = new GetUsuariosInternos(
  usuariosInternosRepository
);
export const getUsuarioInternoByIdUsecase = new GetUsuarioInternoById(
  usuariosInternosRepository
);
export const updateUsuarioInternoUsecase = new UpdateUsuarioInterno(
  usuariosInternosRepository
);
export const resetPasswordUsuarioInternoUsecase = new ResetPasswordUsuarioInterno(
  usuariosInternosRepository
);
export const deactivateUsuarioInternoUsecase = new DeactivateUsuarioInterno(
  usuariosInternosRepository
);
export const assignProgramsToDirectorUsecase = new AssignProgramsToDirector(
  usuariosInternosRepository
);
export const getUserProgramsUsecase = new GetUserPrograms(
  usuariosInternosRepository
);
export const removeUserProgramUsecase = new RemoveUserProgram(
  usuariosInternosRepository
);
export const getRolesUsuariosInternosUsecase = new GetRolesUsuariosInternos(
  usuariosInternosRepository
);
