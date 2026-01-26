import { GroupRepository } from '../../domain/port/groupRepository';

export class GetGroups {
  constructor(private repo: GroupRepository) {}
  async execute() {
    return this.repo.findAll();
  }
}
