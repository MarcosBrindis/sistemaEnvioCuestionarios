import { ImportacionMiembrosService } from '../domain/port/ImportacionMiembrosService';
import { EgresadoRepository } from '../../egresado/domain/port/egresadoRepository';
import { GroupRepository } from '../../group/domain/port/groupRepository';

export class ImportacionMiembrosServiceImpl implements ImportacionMiembrosService {
  constructor(
    private egresadoRepository: EgresadoRepository,
    private groupRepository: GroupRepository
  ) {}

  async importarMiembrosPorFiltro(
    idGrupo: number,
    filtros: {
      id_programa_educativo?: number;
      id_periodo_egreso?: number;
      cohorte?: number;
      prefijo_matricula?: string;
      busqueda?: string;
    }
  ) {
    // Buscar egresados con filtros
    const egresados = await this.egresadoRepository.buscarEgresadosAvanzado(filtros);
    const usuarios_encontrados = egresados.length;
    // Insertar masivamente en el grupo, evitando duplicados
    const ids = egresados.map(e => e.id_egresado).filter((id): id is number => typeof id === 'number');
    const { nuevos_agregados, ya_estaban_en_grupo } = await this.groupRepository.importarMiembrosPorFiltro(idGrupo, ids);
    return {
      mensaje: 'Importación completada',
      usuarios_encontrados,
      nuevos_agregados,
      ya_estaban_en_grupo
    };
  }
}
