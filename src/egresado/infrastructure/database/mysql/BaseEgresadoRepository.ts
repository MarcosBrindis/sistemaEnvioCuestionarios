import { EgresadoRepository, PeriodoRepository, ProgramaEducativoRepository } from '../../../domain/port/egresadoRepository';
import { Egresado } from '../../../domain/model/egresado';

export abstract class BaseEgresadoRepository implements EgresadoRepository {
  abstract findById(id: number): Promise<Egresado | null>;
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
}

export abstract class BasePeriodoRepository implements PeriodoRepository {
  create(_data: { fecha_inicio: string; fecha_fin: string; cohorte: string }): Promise<any> {
    return Promise.reject(new Error('Method not implemented'));
  }
  
  findByCohorte(_cohorte: string): Promise<any | null> {
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