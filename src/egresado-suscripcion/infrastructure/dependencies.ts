
import { UnsubscribeEgresado } from '../application/usecase/UnsubscribeEgresado';
import { ResubscribeEgresado } from '../application/usecase/ResubscribeEgresado';
import { BajaCorreoRepositoryMySQL } from './database/mysql/BajaCorreoRepositoryMySQL';
import { EgresadoRepositoryMySQL } from './database/mysql/EgresadoRepositoryMySQL';

const bajaCorreoRepo = new BajaCorreoRepositoryMySQL();
const egresadoRepo = new EgresadoRepositoryMySQL();

export const dependencies = {
  unsubscribeEgresado: new UnsubscribeEgresado(egresadoRepo, bajaCorreoRepo),
  resubscribeEgresado: new ResubscribeEgresado(egresadoRepo, bajaCorreoRepo),
};
