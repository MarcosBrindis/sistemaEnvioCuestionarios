import { GroupRepository } from '../../domain/port/groupRepository';

export class GetGroupById {
  constructor(private repo: GroupRepository) {}
  async execute(id: number) {
    return this.repo.findById(id);
  }
}
