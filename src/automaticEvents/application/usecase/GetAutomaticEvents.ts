import { AutomaticEventRepository } from '../../domain/port/AutomaticEventRepository';

export class GetAutomaticEvents {
  constructor(private readonly repository: AutomaticEventRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}
