import { Group } from '../model/group';

export interface GroupRepository {
  create(data: Omit<Group, 'id_grupo'>): Promise<Group>;
  findAll(): Promise<Group[]>;
  findById(id: number): Promise<Group | null>;
  update(id: number, data: Partial<Omit<Group, 'id_grupo'>>): Promise<Group | null>;
  delete(id: number): Promise<void>;
  existsByName(nombre: string): Promise<boolean>;
  /**
   * Importa miembros a un grupo por filtro, evitando duplicados
   */
  importarMiembrosPorFiltro(idGrupo: number, idsEgresados: number[]): Promise<{
    nuevos_agregados: number;
    ya_estaban_en_grupo: number;
  }>;
}
