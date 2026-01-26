import { EgresadoRepository, PeriodoRepository, ProgramaEducativoRepository } from '../../../domain/port/egresadoRepository';
import { Egresado } from '../../../domain/model/egresado';

export abstract class BaseEgresadoRepository implements EgresadoRepository {
  abstract findById(id: number): Promise<Egresado | null>;
  abstract updatePerfil(
    id: number,
    data: Partial<Pick<Egresado, 'email' | 'fecha_nacimiento' | 'imagen_egresado'>>
  ): Promise<Egresado>;
  create(_data: Omit<Egresado, 'id_egresado'>): Promise<Egresado> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findByMatricula(_matricula: string): Promise<Egresado | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findAll(): Promise<Egresado[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  existsByMatricula(_matricula: string): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  batchCreate(_egresados: Omit<Egresado, 'id_egresado'>[]): Promise<number> {
    return Promise.reject(new Error('Method not implemented'));
  }

  buscarEgresadosAvanzado(_filtros: {
    id_programa_educativo?: number;
    id_periodo_egreso?: number;
    cohorte?: number;
    busqueda?: string;
  }): Promise<Egresado[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
}

export abstract class BasePeriodoRepository implements PeriodoRepository {
  create(_data: { fecha_inicio: string; fecha_fin: string; cohorte: string; periodo_id_externo?: string }): Promise<any> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findByCohorte(_cohorte: string): Promise<any | null> {
    return Promise.reject(new Error('Method not implemented'));
  }

  findByPeriodoIdExterno(_periodo_id_externo: string): Promise<any | null> {
    return Promise.reject(new Error('Method not implemented'));
  }

  updatePeriodoIdExterno(_cohorte: string, _periodo_id_externo: string): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findAll(): Promise<any[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
}

export abstract class BaseProgramaEducativoRepository implements ProgramaEducativoRepository {
  create(_data: { nombre: string }): Promise<any> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findByIdOrNombre(_id?: string, _nombre?: string): Promise<any | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findAll(): Promise<any[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
}