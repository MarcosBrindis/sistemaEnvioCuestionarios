
import { ImportarMiembrosPorFiltro } from '../application/usecase/ImportarMiembrosPorFiltro';
import { ImportacionMiembrosServiceImpl } from '../infrastructure/ImportacionMiembrosServiceImpl';
import { BuscarEgresadosPorFiltro } from '../application/usecase/BuscarEgresadosPorFiltro';
import { EgresadoRepositoryMySQL } from '../../egresado/infrastructure/database/mysql/EgresadoRepositoryMYSQL';
import { GroupRepositoryMySQL } from '../../group/infrastructure/database/mysql/GroupRepositoryMySQL';

const egresadoRepository = new EgresadoRepositoryMySQL();
const groupRepository = new GroupRepositoryMySQL();
const importacionMiembrosService = new ImportacionMiembrosServiceImpl(egresadoRepository, groupRepository);

export const dependencies = {
  importarMiembrosPorFiltro: new ImportarMiembrosPorFiltro(importacionMiembrosService),
  buscarEgresadosPorFiltro: new BuscarEgresadosPorFiltro(egresadoRepository)
};
