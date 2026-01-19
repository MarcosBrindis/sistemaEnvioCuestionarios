import { ApiClientRepository } from '../../domain/port/ApiClientRepository';

export class ListClientsUseCase {
  constructor(private repo: ApiClientRepository) {}

  async execute() {
    return this.repo.list();
  }
}
