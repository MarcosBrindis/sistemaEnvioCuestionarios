export interface ImportacionMiembrosService {
  importarMiembrosPorFiltro(
    idGrupo: number,
    filtros: {
      id_programa_educativo?: number;
      id_periodo_egreso?: number;
      cohorte?: number;
      prefijo_matricula?: string;
      busqueda?: string;
    }
  ): Promise<{
    mensaje: string;
    usuarios_encontrados: number;
    nuevos_agregados: number;
    ya_estaban_en_grupo: number;
  }>;
}
