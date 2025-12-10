import { GroupRepository } from '../../domain/port/groupRepository';
import { Group } from '../../domain/model/group';

export class UpdateGroup {
  constructor(private repo: GroupRepository) {}
  async execute(id: number, data: Partial<Omit<Group, 'id_grupo'>>): Promise<Group | null> {
    // Si se actualiza el nombre, validar unicidad
    if (data.nombre) {
      const exists = await this.repo.existsByName(data.nombre);
      if (exists) {
        throw new Error('Ya existe un grupo con ese nombre');
      }
    }
    return this.repo.update(id, data);
  }
}
