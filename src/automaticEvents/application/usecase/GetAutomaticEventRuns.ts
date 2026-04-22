import { AutomaticEventRepository } from '../../domain/port/AutomaticEventRepository';

export class GetAutomaticEventRuns {
  constructor(private readonly repository: AutomaticEventRepository) {}

  async execute(id_event: number) {
    return this.repository.listRuns(id_event);
  }
}
