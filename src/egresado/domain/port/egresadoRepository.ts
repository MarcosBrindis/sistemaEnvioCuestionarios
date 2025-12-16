import { Egresado } from '../model/egresado';

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
}

export interface PeriodoRepository {
  create(data: { fecha_inicio: string; fecha_fin: string; cohorte: string }): Promise<any>;
  findByCohorte(cohorte: string): Promise<any | null>;
  findAll(): Promise<any[]>;
}

export interface ProgramaEducativoRepository {
  create(data: { nombre: string }): Promise<any>;
  findByIdOrNombre(id?: string, nombre?: string): Promise<any | null>;
  findAll(): Promise<any[]>;
}
