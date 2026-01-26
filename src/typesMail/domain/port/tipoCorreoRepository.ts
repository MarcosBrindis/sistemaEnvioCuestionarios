import { TipoCorreo } from '../model/tipoCorreo';


export interface TipoCorreoRepository {
  create(tipo: string): Promise<TipoCorreo>;
  findAll(): Promise<TipoCorreo[]>;
  findById(id: number): Promise<TipoCorreo | null>;
  update(id: number, tipo: string): Promise<TipoCorreo>;
  delete(id: number): Promise<void>;
  existsByTipo(tipo: string): Promise<boolean>;
  isUsedInTemplates(id: number): Promise<boolean>;
}
