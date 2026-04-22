import { AutomaticEventRepository } from '../../domain/port/AutomaticEventRepository';

export class GetAutomaticEventById {
  constructor(private readonly repository: AutomaticEventRepository) {}

  async execute(id_event: number) {
    return this.repository.findById(id_event);
  }
}
