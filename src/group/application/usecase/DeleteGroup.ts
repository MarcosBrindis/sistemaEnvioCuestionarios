import { GroupRepository } from '../../domain/port/groupRepository';

export class DeleteGroup {
  constructor(private repo: GroupRepository) {}
  async execute(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
