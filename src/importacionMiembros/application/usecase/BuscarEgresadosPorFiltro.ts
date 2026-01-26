import { EgresadoRepository } from '../../../egresado/domain/port/egresadoRepository';

export class BuscarEgresadosPorFiltro {
  constructor(private egresadoRepository: EgresadoRepository) {}

  async execute(filtros: {
    id_programa_educativo?: number;
    id_periodo_egreso?: number;
    cohorte?: number;
    prefijo_matricula?: string; // Ejemplo: '113' (3 primeros dígitos de matrícula)
    busqueda?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    // Lógica de paginación
    const page = filtros.page || 1;
    const limit = filtros.limit || 20;
    const offset = (page - 1) * limit;

    // Construir filtros para el repositorio
    const repoFiltros: any = {};
    if (filtros.id_programa_educativo) repoFiltros.id_programa_educativo = filtros.id_programa_educativo;
    if (filtros.id_periodo_egreso) repoFiltros.id_periodo_egreso = filtros.id_periodo_egreso;
    if (filtros.cohorte) repoFiltros.cohorte = filtros.cohorte;
    if (filtros.prefijo_matricula) repoFiltros.prefijo_matricula = filtros.prefijo_matricula;
    if (filtros.busqueda) repoFiltros.busqueda = filtros.busqueda;

    // Buscar todos los egresados que cumplen el filtro
    const todos = await this.egresadoRepository.buscarEgresadosAvanzado(repoFiltros);
    const total = todos.length;
    // Paginar
    const data = todos.slice(offset, offset + limit);
    return { data, total, page, limit };
  }
}
