import { Egresado, EstadoEgresadoCatalogo } from '../model/egresado';

export interface EgresadoRepository {
  create(data: Omit<Egresado, 'id_egresado'>): Promise<Egresado>;
  findByMatricula(matricula: string): Promise<Egresado | null>;
  findAll(): Promise<Egresado[]>;
  existsByMatricula(matricula: string): Promise<boolean>;
  batchCreate(egresados: Omit<Egresado, 'id_egresado'>[]): Promise<number>;
  findById(id: number): Promise<Egresado | null>;
  /**
   * Actualiza los datos de perfil permitidos de un egresado.
   * @param id ID del egresado
   * @param data Campos a actualizar (solo email, fecha_nacimiento, imagen_egresado)
   */
  updatePerfil(id: number, data: Partial<Pick<Egresado, 'email' | 'fecha_nacimiento' | 'imagen_egresado'>>): Promise<Egresado>;
  /**
   * Actualiza el estado de un egresado
   * @param id ID del egresado
   * @param idEstado ID del estado
   */
  updateEstado(id: number, idEstado: number): Promise<Egresado>;
  /**
   * Actualiza el perfil completo de un egresado (con estado)
   * @param id ID del egresado
   * @param data Campos a actualizar (todos excepto matricula, curp, id_egresado)
   */
  updatePerfilCompleto(id: number, data: Partial<Pick<Egresado, 'nombre' | 'primer_apellido' | 'segundo_apellido' | 'email' | 'fecha_nacimiento' | 'imagen_egresado' | 'id_programa_educativo' | 'id_periodo' | 'id_estado'>>): Promise<Egresado>;
  /**
   * Obtiene los estados disponibles para egresados
   */
  getEstados(): Promise<EstadoEgresadoCatalogo[]>;
  /**
   * Búsqueda avanzada de egresados con filtros y texto libre
   */
  buscarEgresadosAvanzado(filtros: {
    id_programa_educativo?: number;
    id_periodo_egreso?: number;
    cohorte?: number;
    prefijo_matricula?: string;
    busqueda?: string;
  }): Promise<Egresado[]>;
}

export interface PeriodoRepository {
  create(data: { fecha_inicio: string; fecha_fin: string; cohorte: string; periodo_id_externo?: string }): Promise<any>;
  findByCohorte(cohorte: string): Promise<any | null>;
  findByPeriodoIdExterno(periodo_id_externo: string): Promise<any | null>;
  updatePeriodoIdExterno(cohorte: string, periodo_id_externo: string): Promise<void>;
  findAll(): Promise<any[]>;
}

export interface ProgramaEducativoRepository {
  create(data: { nombre: string }): Promise<any>;
  findByIdOrNombre(id?: string, nombre?: string): Promise<any | null>;
  findAll(): Promise<any[]>;
}
