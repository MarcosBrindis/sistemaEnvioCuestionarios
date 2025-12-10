import { Group } from '../model/group';

export interface GroupRepository {
  create(data: Omit<Group, 'id_grupo'>): Promise<Group>;
  findAll(): Promise<Group[]>;
  findById(id: number): Promise<Group | null>;
  update(id: number, data: Partial<Omit<Group, 'id_grupo'>>): Promise<Group | null>;
  delete(id: number): Promise<void>;
  existsByName(nombre: string): Promise<boolean>;
}
