import { GroupRepository } from '../../domain/port/groupRepository';
import { Group } from '../../domain/model/group';

export class CreateGroup {
  constructor(private repo: GroupRepository) {}
  async execute(data: Omit<Group, 'id_grupo'>): Promise<Group> {
    const exists = await this.repo.existsByName(data.nombre);
    if (exists) {
      throw new Error('Ya existe un grupo con ese nombre');
    }
    return this.repo.create(data);
  }
}
