import { AutomaticEventRepository } from '../../domain/port/AutomaticEventRepository';

export class ActivateAutomaticEvent {
  constructor(private readonly repository: AutomaticEventRepository) {}

  async execute(id_event: number, updated_by: number) {
    return this.repository.setActive(id_event, true, updated_by);
  }
}
