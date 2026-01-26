import { TipoCorreoRepositoryMySQL } from './database/mysql/TipoCorreoRepositoryMySQL';
import { CreateTipoCorreo } from '../application/usecase/CreateTipoCorreo';
import { GetTiposCorreo } from '../application/usecase/GetTiposCorreo';
import { UpdateTipoCorreo } from '../application/usecase/UpdateTipoCorreo';
import { DeleteTipoCorreo } from '../application/usecase/DeleteTipoCorreo';
import { GetTipoCorreoById } from '../application/usecase/GetTiposCorreo';

const tipoCorreoRepo = new TipoCorreoRepositoryMySQL();

export const dependencies = {
  createTipoCorreo: new CreateTipoCorreo(tipoCorreoRepo),
  getTiposCorreo: new GetTiposCorreo(tipoCorreoRepo),
  getTipoCorreoById: new GetTipoCorreoById(tipoCorreoRepo),
  updateTipoCorreo: new UpdateTipoCorreo(tipoCorreoRepo),
  deleteTipoCorreo: new DeleteTipoCorreo(tipoCorreoRepo),
};
