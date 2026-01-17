import { ImportacionMiembrosService } from '../../domain/port/ImportacionMiembrosService';

export class ImportarMiembrosPorFiltro {
  constructor(private importacionService: ImportacionMiembrosService) {}

  async execute(idGrupo: number, filtros: {
    id_programa_educativo?: number;
    id_periodo_egreso?: number;
    cohorte?: number;
    prefijo_matricula?: string;
    busqueda?: string;
  }) {
    return this.importacionService.importarMiembrosPorFiltro(idGrupo, filtros);
  }
}
