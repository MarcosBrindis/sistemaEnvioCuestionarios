import { PlatinumAPI } from './external/PlatinumAPI';
import { SyncEgresadosFromPlatinum } from '../application/usecase/SyncEgresadosFromPlatinum';
import { ActualizarPeriodosEgresados } from '../application/usecase/ActualizarPeriodosEgresados';
import { EgresadoRepositoryMySQL } from './database/mysql/EgresadoRepositoryMYSQL';
import { UpdateEgresadoPerfil } from '../application/usecase/UpdateEgresadoPerfil';
import { PeriodoRepositoryMySQL } from './database/mysql/PeriodoRepositoryMYSQL';
import { ProgramaEducativoRepositoryMySQL } from './database/mysql/ProgramaEducativoRepositoryMYSQL';
import { GetProgramasEducativos } from '../application/usecase/GetProgramasEducativos';

const egresadoRepo = new EgresadoRepositoryMySQL();
const periodoRepo = new PeriodoRepositoryMySQL();
const programaRepo = new ProgramaEducativoRepositoryMySQL();

const platinumAPI = new PlatinumAPI();

const BATCH_SIZE = parseInt(process.env.EGRESADOS_BATCH_SIZE || '50');

export const dependencies = {
  syncEgresadosFromPlatinum: new SyncEgresadosFromPlatinum(
    platinumAPI,
    egresadoRepo,
    periodoRepo,
    programaRepo,
    BATCH_SIZE
  ),
  actualizarPeriodosEgresados: new ActualizarPeriodosEgresados(
    platinumAPI,
    egresadoRepo,
    periodoRepo,
    BATCH_SIZE
  ),
  getProgramasEducativos: new GetProgramasEducativos(programaRepo),
  egresadoRepository: egresadoRepo,
  periodoRepository: periodoRepo,
  programaEducativoRepository: programaRepo,
  updateEgresadoPerfil: new UpdateEgresadoPerfil(egresadoRepo)
};

export const egresadoRepository = egresadoRepo;